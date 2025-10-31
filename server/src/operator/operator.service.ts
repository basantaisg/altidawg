import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateOperatorDto } from "./dto/create-operator.dto.js";
import { randomBytes } from "crypto";

@Injectable()
export class OperatorService {
  constructor(private readonly prisma: PrismaService) {}

  async createOperator(dto: CreateOperatorDto) {
    const apiKey = randomBytes(24).toString("hex");
    const operator = await this.prisma.operator.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        email: dto.email,
        apiKey,
      },
    });
    return {
      message: "Operator Created!",
      operatorId: operator.id,
      apiKey: operator.apiKey,
    };
  }

  async findByApiKey(apiKey: string) {
    return this.prisma.operator.findUnique({ where: { apiKey } });
  }

  async getAnalytics(operatorId: string) {
    const experiences = await this.prisma.experience.findMany({
      where: { operatorId },
      select: { id: true },
    });

    const experienceIds = experiences.map((e) => e.id);

    const slots = await this.prisma.slot.findMany({
      where: { experienceId: { in: experienceIds } },
      select: { id: true },
    });

    const slotIds = slots.map((s) => s.id);

    const bookings = await this.prisma.booking.findMany({
      where: { slotId: { in: slotIds } },
      select: { status: true },
    });

    const confirmed = bookings.filter((b) => b.status === "CONFIRMED").length;
    const pending = bookings.filter((b) => b.status === "PENDING").length;
    const declined = bookings.filter((b) => b.status === "DECLINED").length;

    return {
      totalExperiences: experiences.length,
      totalSlots: slots.length,
      totalBookings: bookings.length,
      confirmed,
      pending,
      declined,
    };
  }
}
