import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateExperienceDto } from "./dto/create-experience.dto";
import { UpdateExperienceDto } from "./dto/update-experience.dto";
import axios from "axios";

@Injectable()
export class ExperienceService {
  constructor(private prisma: PrismaService) {}

  // --- AI enrichment using Gemini ---
  private async aiEnrich(description: string) {
    const prompt = `
      You are an assistant that helps classify tourism experiences.
      Analyze this description and return JSON exactly in this format:
      {
        "tags": ["3-5 short relevant tourism tags"],
        "summary": "one-line catchy summary under 15 words"
      }
      Description: """${description}"""
    `;

    try {
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const content = res.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const clean = content.replace(/```json|```/g, "").trim();

      return JSON.parse(clean);
    } catch (err: any) {
      console.error(
        "Gemini enrichment error:",
        err.response?.data || err.message
      );
      return {
        tags: ["culture", "local", "adventure"],
        summary: "Experience Nepal’s authentic local lifestyle.",
      };
    }
  }

  // --- Create new experience (operator only) ---
  async create(dto: CreateExperienceDto, operatorId: string) {
    let tags = dto.tags || [];
    let summary: string | undefined;

    // Auto-enrich with AI if tags missing
    if (!tags || tags.length === 0) {
      const enriched = await this.aiEnrich(dto.description);
      tags = enriched.tags || ["culture", "local"];
      summary = enriched.summary || "Unique Nepali experience.";
    }

    const experience = await this.prisma.experience.create({
      data: {
        operatorId,
        title: dto.title,
        description: dto.description,
        city: dto.city,
        tags,
        summary,
        priceNpr: dto.priceNPR,
        maxGroupSize: dto.maxGroupSize,
        coverImageUrl: dto.coverImageUrl,
        geoLat: dto.geoLat,
        geolng: dto.geoLng ?? null, // <- use 'geolng' to match Prisma
        isActive: true,
      },
    });

    return {
      message: "Experience created",
      id: experience.id,
      tags: experience.tags,
      summary: experience.summary,
    };
  }

  // --- Update experience ---
  async update(id: string, dto: UpdateExperienceDto, operatorId: string) {
    const exp = await this.prisma.experience.findUnique({ where: { id } });
    if (!exp || exp.operatorId !== operatorId)
      throw new Error("Unauthorized or experience not found");

    const updated = await this.prisma.experience.update({
      where: { id },
      data: { ...dto },
    });
    return { message: "Experience updated", id: updated.id };
  }

  // --- List public experiences ---
  async listPublic(city?: string, tag?: string) {
    const where: any = { isActive: true };
    if (city) where.city = city;

    const exps = await this.prisma.experience.findMany({
      where,
      include: {
        slots: {
          select: {
            id: true,
            startTime: true,
            seatsTotal: true,
            seatsBooked: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    let filtered = exps;
    if (tag) filtered = exps.filter((e) => (e.tags || []).includes(tag));
    return filtered;
  }

  // --- Get single experience by ID ---
  async getOne(id: string) {
    const exp = await this.prisma.experience.findUnique({
      where: { id },
      include: { slots: true },
    });
    if (!exp) throw new Error("Experience not found");
    return exp;
  }
}
