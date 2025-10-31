import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  // Public: create booking (always PENDING)
  async create(dto: CreateBookingDto) {
    const slot = await this.prisma.slot.findUnique({
      where: { id: dto.slotId },
      include: { experience: true },
    });
    if (!slot) throw new NotFoundException("Slot not found");
    if (slot.seatsBooked >= slot.seatsTotal)
      throw new BadRequestException("Slot is already full");

    const booking = await this.prisma.booking.create({
      data: {
        slotId: dto.slotId,
        customerName: dto.customerName,
        customerPhone: dto.customerPhone,
        pax: dto.pax,
        note: dto.note,
        status: "PENDING",
      },
    });
    return {
      message: "Booking created",
      bookingId: booking.id,
      status: booking.status,
    };
  }

  // Operator: confirm booking (safe seat decrement)
  async confirm(bookingId: string, operatorId: string) {
    return this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        include: { slot: { include: { experience: true } } },
      });
      if (!booking) throw new NotFoundException("Booking not found");
      const { slot } = booking;
      if (slot.experience.operatorId !== operatorId)
        throw new BadRequestException("Unauthorized");

      if (slot.seatsBooked + booking.pax > slot.seatsTotal)
        throw new BadRequestException("Slot full, cannot confirm");

      await tx.slot.update({
        where: { id: slot.id },
        data: { seatsBooked: slot.seatsBooked + booking.pax },
      });

      const updated = await tx.booking.update({
        where: { id: booking.id },
        data: { status: "CONFIRMED" },
      });

      return {
        message: "Booking confirmed",
        bookingId: updated.id,
        status: updated.status,
      };
    });
  }

  // Operator: decline booking
  async decline(bookingId: string, operatorId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { slot: { include: { experience: true } } },
    });
    if (!booking) throw new NotFoundException("Booking not found");
    if (booking.slot.experience.operatorId !== operatorId)
      throw new BadRequestException("Unauthorized");

    await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: "DECLINED" },
    });

    return { message: "Booking declined", bookingId };
  }
}
