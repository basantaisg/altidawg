import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateExperienceDto } from "./dto/create-experience.dto";
import { UpdateExperienceDto } from "./dto/update-experience.dto";

@Injectable()
export class ExperienceService {
  constructor(private prisma: PrismaService) {}

  // Create new experience (operator only)
  async create(dto: CreateExperienceDto, operatorId: string) {
    const experience = await this.prisma.experience.create({
      data: {
        ...dto,
        operatorId,
        isActive: true,
      },
    });
    return { message: "Experience created", id: experience.id };
  }

  // Update an existing experience
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

  // List public experiences with optional filters
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

    // Optional tag filter
    let filtered = exps;
    if (tag) filtered = exps.filter((e) => (e.tags || []).includes(tag));

    return filtered;
  }

  // Get one experience by ID (public)
  async getOne(id: string) {
    const exp = await this.prisma.experience.findUnique({
      where: { id },
      include: { slots: true },
    });
    if (!exp) throw new Error("Experience not found");
    return exp;
  }
}
