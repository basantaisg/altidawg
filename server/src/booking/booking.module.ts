import { Module } from "@nestjs/common";
import { BookingController } from "./booking.controller";
import { BookingService } from "./booking.service";
import { OperatorGuard } from "../operator/operator.guard";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
  controllers: [BookingController],
  providers: [BookingService, PrismaService, OperatorGuard],
})
export class BookingModule {}
