import { Module } from "@nestjs/common";
import { SlotController } from "./slot.controller";
import { SlotService } from "./slot.service";
import { OperatorGuard } from "../operator/operator.guard";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [SlotController],
  providers: [SlotService, OperatorGuard],
  exports: [SlotService],
})
export class SlotModule {}
