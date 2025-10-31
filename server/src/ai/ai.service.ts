import { Injectable } from "@nestjs/common";
import axios from "axios";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AiService {
  constructor(private prisma: PrismaService) {}

  private baseUrl =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
  private key = process.env.GEMINI_API_KEY;

  // Core function to call Gemini
  private async callGemini(prompt: string) {
    try {
      const res = await axios.post(
        `${this.baseUrl}?key=${this.key}`,
        { contents: [{ parts: [{ text: prompt }] }] },
        { headers: { "Content-Type": "application/json" } }
      );
      return res.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } catch (err: any) {
      console.error("Gemini call failed:", err.response?.data || err.message);
      return "";
    }
  }

  // 🧠 AI Trip Planner
  async planTrip(city: string, days: number, interests?: string[]) {
    // 1️⃣ Pull relevant experiences from DB
    const exps = await this.prisma.experience.findMany({
      where: { city: { equals: city, mode: "insensitive" }, isActive: true },
      take: 10,
      select: { title: true, description: true, tags: true },
    });

    if (exps.length === 0)
      return {
        title: `AI Trip Plan for ${city}`,
        itinerary: [`No local experiences found for ${city} yet.`],
      };

    // 2️⃣ Build prompt with context
    const context = exps
      .map(
        (e) =>
          `Title: ${e.title}\nTags: ${e.tags?.join(", ")}\nDescription: ${e.description}`
      )
      .join("\n\n");

    // Safe fallback for missing or wrong interests
    const safeInterests = Array.isArray(interests) ? interests : [];
    const interestsText = safeInterests.length
      ? safeInterests.join(", ")
      : "general tourism";

    const prompt = `
      You are a Nepali travel planner AI.
      Create a ${days}-day trip itinerary for ${city}, based on these local experiences:

      ${context}

      Focus on user interests: ${interestsText}.
      The output must be pure JSON:

      {
        "title": "short trip title",
        "itinerary": [
          "Day 1: ...",
          "Day 2: ...",
          ...
        ]
      }
    `;

    // 3️⃣ Call Gemini API
    const result = await this.callGemini(prompt);

    // 4️⃣ Parse output safely
    try {
      const json = JSON.parse(result.replace(/```json|```/g, "").trim());
      return json;
    } catch {
      return {
        title: `${days}-Day ${city} Trip Plan`,
        itinerary: [
          `Day 1: Explore the heart of ${city} and try local food.`,
          `Day 2: Visit scenic sites and meet locals.`,
          `Day 3: Relax and enjoy the culture.`,
        ].slice(0, days),
      };
    }
  }
}
