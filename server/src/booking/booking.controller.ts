import { Controller, Post, Body, Param, UseGuards, Req } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { OperatorGuard } from "../operator/operator.guard";

@Controller()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // -------- PUBLIC --------
  @Post("/v1/public/bookings")
  async create(@Body() dto: CreateBookingDto) {
    return this.bookingService.create(dto);
  }

  // -------- OPERATOR --------
  @UseGuards(OperatorGuard)
  @Post("/v1/operator/bookings/:id/confirm")
  async confirm(@Param("id") id: string, @Req() req) {
    return this.bookingService.confirm(id, req.operator.id);
  }

  @UseGuards(OperatorGuard)
  @Post("/v1/operator/bookings/:id/decline")
  async decline(@Param("id") id: string, @Req() req) {
    return this.bookingService.decline(id, req.operator.id);
  }
}
