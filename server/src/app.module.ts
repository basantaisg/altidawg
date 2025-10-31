import { Module } from "@nestjs/common";
import { OperatorModule } from "./operator/operator.module.js";
import { ExperienceModule } from "./experience/experience.module.js";
import { BookingModule } from "./booking/booking.module.js";
import { SharedModule } from "./shared/shared.module.js";
import { PrismaModule } from "./prisma/prisma.module.js";
import { SlotModule } from './slot/slot.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    OperatorModule,
    ExperienceModule,
    BookingModule,
    SharedModule,
    PrismaModule,
    SlotModule,
    AiModule,
  ],
})
export class AppModule {}
