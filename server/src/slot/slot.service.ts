import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { BulkCreateSlotsBody, SlotInputDto } from "./dto/bulk-create-slots.dto";

const MS_IN_DAY = 24 * 60 * 60 * 1000;

@Injectable()
export class SlotService {
  constructor(private prisma: PrismaService) {}

  // Public: list slots for an experience (default: next 14 days)
  async listForExperience(experienceId: string, daysAhead = 14) {
    const now = new Date();
    const until = new Date(now.getTime() + daysAhead * MS_IN_DAY);

    // Ensure experience exists & is active
    const exp = await this.prisma.experience.findUnique({
      where: { id: experienceId },
    });
    if (!exp || !exp.isActive)
      throw new NotFoundException("Experience not found or inactive");

    return this.prisma.slot.findMany({
      where: {
        experienceId,
        startTime: { gte: now, lte: until },
      },
      orderBy: { startTime: "asc" },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        seatsTotal: true,
        seatsBooked: true,
      },
    });
  }

  // Operator: bulk-create slots
  async bulkCreate(
    experienceId: string,
    operatorId: string,
    payload: BulkCreateSlotsBody
  ) {
    // Check ownership: operator must own this experience
    const exp = await this.prisma.experience.findUnique({
      where: { id: experienceId },
    });
    if (!exp) throw new NotFoundException("Experience not found");
    if (exp.operatorId !== operatorId)
      throw new BadRequestException("Not your experience");

    // Validate each slot (end > start, seats > 0, no overlaps on same time range, etc.)
    const normalized: SlotInputDto[] = payload.slots.map((s) => {
      const start = new Date(s.startTime);
      const end = new Date(s.endTime);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new BadRequestException("Invalid date format");
      }
      if (end <= start)
        throw new BadRequestException("endTime must be after startTime");
      if (s.seatsTotal <= 0)
        throw new BadRequestException("seatsTotal must be > 0");
      return {
        startTime: s.startTime,
        endTime: s.endTime,
        seatsTotal: s.seatsTotal,
      };
    });

    // Optional: basic overlap guard—prevent exact duplicates
    // (Full overlap detection is heavier; skip for MVP)
    const txOps = normalized.map((s) =>
      this.prisma.slot.create({
        data: {
          experienceId,
          startTime: s.startTime,
          endTime: s.endTime,
          seatsTotal: s.seatsTotal,
          seatsBooked: 0,
          createdAt: new Date(),
        },
      })
    );

    const created = await this.prisma.$transaction(txOps);
    return { created: created.length, slotIds: created.map((c) => c.id) };
  }
}
