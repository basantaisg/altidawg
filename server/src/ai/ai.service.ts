import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";
import axios from "axios";
import { TripPlan, TripDay, EnrichResult } from "./types";

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly MAX_RETRIES = 2;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService
  ) {
    const apiKey = this.config.get<string>("GEMINI_API_KEY");
    if (!apiKey) {
      this.logger.warn("GEMINI_API_KEY is not set - AI features will not work");
    }
  }

  // Try to find a model that supports generation by calling ListModels on
  // possible API versions. Returns the first matching model name and the api
  // version used.
  private async findSupportedModel(
    apiKey: string
  ): Promise<{ model: string; apiVersion: string } | null> {
    const triedVersions = ["v1", "v1beta"];
    for (const ver of triedVersions) {
      try {
        const url = `https://generativelanguage.googleapis.com/${ver}/models?key=${apiKey}`;
        const res = await axios.get(url, { timeout: 8000 });
        const models = res?.data?.models || [];
        if (!Array.isArray(models)) continue;

        // Prefer models that explicitly support generation methods.
        for (const m of models) {
          const name: string = m?.name;
          const supported =
            m?.supportedMethods ||
            m?.supportedGenerationMethods ||
            m?.supportedGeneration ||
            [];
          // If supportedMethods is a string or object, try to be defensive
          const includesGenerate = Array.isArray(supported)
            ? supported.includes("generateContent")
            : false;

          if (includesGenerate)
            return { model: name.replace(/^models\//, ""), apiVersion: ver };
        }

        // Fallback: pick a gemini-like model if present
        const gemini = models.find(
          (x: any) =>
            typeof x?.name === "string" &&
            x.name.toLowerCase().includes("gemini")
        );
        if (gemini)
          return {
            model: gemini.name.replace(/^models\//, ""),
            apiVersion: ver,
          };
      } catch (e) {
        // ignore and try next version
        this.logger.debug(
          `ListModels failed for version ${ver}: ${e?.message ?? e}`
        );
      }
    }
    return null;
  }

  // ---- Gemini call helper ----
  private async callGemini(
    prompt: string,
    retryCount = 0,
    overrideModel?: string,
    overrideApiVersion?: string
  ): Promise<string> {
    const apiKey = this.config.get<string>("GEMINI_API_KEY");
    // Allow overriding via env/config. If provided, env wins unless an override
    // is passed into the call.
    const configuredModel = this.config.get<string>("GEMINI_MODEL");
    const configuredApiVersion = this.config.get<string>("GEMINI_API_VERSION");

    let model = overrideModel || configuredModel;
    let apiVersion = overrideApiVersion || configuredApiVersion;

    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

    // If model or apiVersion aren't configured, try to find one via ListModels
    if (!model || !apiVersion) {
      try {
        const discovery = await this.findSupportedModel(apiKey);
        if (discovery) {
          model = model || discovery.model;
          apiVersion = apiVersion || discovery.apiVersion;
          this.logger.log(
            `Discovered model ${model} (apiVersion=${apiVersion})`
          );
        }
      } catch (e) {
        this.logger.warn(
          "Failed to discover available models, proceeding with configured values if any"
        );
      }
    }

    if (!model || !apiVersion) {
      throw new Error(
        "No Gemini model or API version configured or discoverable"
      );
    }

    const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent?key=${apiKey}`;

    try {
      const { data } = await axios.post(
        url,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          safetySettings: [
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_LOW_AND_ABOVE",
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 1,
            topP: 0.8,
            maxOutputTokens: 2048,
          },
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 15000,
        }
      );

      // Log the raw response for debugging
      this.logger.debug("Raw Gemini response:", JSON.stringify(data, null, 2));

      // Safety check
      if (data.promptFeedback?.blockReason) {
        this.logger.error("Content blocked:", data.promptFeedback.blockReason);
        throw new Error(`Content blocked: ${data.promptFeedback.blockReason}`);
      }

      // Get first candidate
      const result = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!result) {
        this.logger.error("Invalid Gemini response format:", data);
        throw new Error("Failed to generate content");
      }

      return result;
    } catch (err: any) {
      const status = err?.response?.status;
      const message = err?.response?.data?.error?.message || err?.message;
      if (status === 404) {
        this.logger.error(
          `Gemini 404: ${message}. Check GEMINI_MODEL='${model}' and GEMINI_API_VERSION='${apiVersion}'.`
        );

        // If we got a 404 for the configured model, try to discover a usable
        // model and retry once with that discovered model.
        if (retryCount < this.MAX_RETRIES) {
          try {
            const discovered = await this.findSupportedModel(apiKey);
            if (discovered && discovered.model && discovered.apiVersion) {
              this.logger.log(
                `Retrying with discovered model ${discovered.model} (api=${discovered.apiVersion})`
              );
              return this.callGemini(
                prompt,
                retryCount + 1,
                discovered.model,
                discovered.apiVersion
              );
            }
          } catch (e) {
            this.logger.debug(
              "Model discovery during 404 retry failed",
              e?.message ?? e
            );
          }
        }
      } else {
        this.logger.error(
          `Gemini call failed [${status ?? "no-status"}]: ${message}`
        );
      }

      if (retryCount < this.MAX_RETRIES) {
        this.logger.warn(
          `AI call failed, retrying (${retryCount + 1}/${this.MAX_RETRIES})`
        );
        await new Promise((r) => setTimeout(r, 1000 * (retryCount + 1)));
        return this.callGemini(
          prompt,
          retryCount + 1,
          overrideModel,
          overrideApiVersion
        );
      }
      throw new Error("Failed to generate AI response");
    }
  }

  // ---- Trip planner with strict length & padding ----
  async planTrip(
    city: string,
    days: number,
    interests?: string[]
  ): Promise<TripPlan> {
    const targetDays = Math.max(1, Math.min(10, Number(days) || 3));
    const safeInterests = Array.isArray(interests)
      ? interests.map((s) => s.toLowerCase())
      : [];

    const exps = await this.prisma.experience.findMany({
      where: { city: { equals: city, mode: "insensitive" }, isActive: true },
      take: 12,
      select: { title: true, description: true, tags: true },
    });

    const context =
      exps.length > 0
        ? exps
            .map(
              (e) =>
                `Title: ${e.title}\nTags: ${(e.tags || []).join(", ")}\nDescription: ${e.description}`
            )
            .join("\n\n")
        : "No local experiences available. Use common attractions, nature, culture and food.";

    const interestsText = safeInterests.length
      ? safeInterests.join(", ")
      : "general tourism";

    const prompt = `
You are a Nepali travel planner AI.

City: ${city}
Days: ${targetDays}
Traveler interests: ${interestsText}

Local experiences (use as inspiration when relevant):
${context}

Return STRICT JSON ONLY (no markdown fences) exactly matching this schema:
{
  "title": "short trip title",
  "itinerary": [
    { "day": 1, "description": "one-sentence overview", "activities": ["activity 1","activity 2","activity 3"] }
  ]
}

RULES:
- "itinerary" MUST have EXACTLY ${targetDays} items.
- Always fill all days even if local experiences are sparse (invent reasonable activities for ${city}).
- Activities should be practical (walking times, landmarks, food spots, local culture).
- Do not prefix description with "Day X:" (that's a separate "day" field).
- Keep each day 2–4 activities; concise and actionable.
`;

    const raw = await this.callGemini(prompt);

    const parseSafe = (txt: string) => {
      try {
        return JSON.parse(txt.replace(/```json|```/g, "").trim());
      } catch {
        return null;
      }
    };

    const parsed: any = parseSafe(raw) || {
      title: `${targetDays}-Day ${city} Trip`,
      itinerary: [],
    };

    const makeDay = (d: number): TripDay => {
      const base = safeInterests[0] || "culture";
      return {
        day: d,
        description: `Explore ${city}'s ${base} highlights.`,
        activities: [
          `Morning walk and breakfast in ${city}`,
          `Midday visit to a popular ${base} spot`,
          `Local food tasting in the evening`,
        ],
      };
    };

    const normItems = Array.isArray(parsed.itinerary) ? parsed.itinerary : [];
    let normalized: TripDay[] = normItems.map((item: any, idx: number) => {
      const dayNum = Number.isFinite(item?.day) ? item.day : idx + 1;
      const desc =
        typeof item?.description === "string" && item.description.trim()
          ? item.description.trim()
          : `Activities planned for Day ${dayNum}.`;

      let acts: string[] = Array.isArray(item?.activities)
        ? item.activities.map(String).filter(Boolean)
        : [];

      if (acts.length < 2) {
        const base = safeInterests[0] || "culture";
        while (acts.length < 3) {
          const suggestions = [
            `Visit a notable ${base} site`,
            `Try a local ${base} experience`,
            `Sample regional cuisine`,
            `Sunset viewpoint or lakeside stroll`,
          ];
          acts.push(suggestions[(acts.length + dayNum) % suggestions.length]);
        }
        acts = acts.slice(0, 4);
      } else if (acts.length > 4) {
        acts = acts.slice(0, 4);
      }

      return { day: dayNum, description: desc, activities: acts };
    });

    // pad/trim to exact length and renumber 1..N
    if (normalized.length < targetDays) {
      for (let d = normalized.length + 1; d <= targetDays; d++)
        normalized.push(makeDay(d));
    } else if (normalized.length > targetDays) {
      normalized = normalized.slice(0, targetDays);
    }
    normalized = normalized.map((d, i) => ({ ...d, day: i + 1 }));

    const title =
      typeof parsed.title === "string" && parsed.title.trim()
        ? parsed.title.trim()
        : `${targetDays}-Day ${city} Trip Plan`;

    const result: TripPlan = { title, itinerary: normalized };
    this.logger.debug(`Generated trip plan for ${city}: ${result.title}`);
    return result;
  }

  async enrichExperience(description: string): Promise<EnrichResult> {
    const prompt = `
You are a tourism experience analyzer.
From this description, return JSON matching this schema:
{
  "tags": ["3-5 relevant tags"],
  "summary": "a catchy 1-line summary"
}

Description: """${description}"""
`;

    try {
      const raw = await this.callGemini(prompt);
      const result = JSON.parse(raw.replace(/```json|```/g, "").trim());

      if (!result.tags || !Array.isArray(result.tags) || !result.summary) {
        throw new Error("Invalid AI response format");
      }

      return {
        tags: result.tags.slice(0, 5).map(String),
        summary: String(result.summary).trim(),
      };
    } catch (error) {
      this.logger.error("Experience enrichment failed:", error);
      return {
        tags: ["culture", "local"],
        summary: "Authentic Nepali cultural experience",
      };
    }
  }
}
