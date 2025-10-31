import { Module } from "@nestjs/common";
import { OperatorController } from "./operator.controller.js";
import { OperatorService } from "./operator.service.js";
import { OperatorGuard } from "./operator.guard.js";
import { PrismaModule } from "../prisma/prisma.module.js";

@Module({
  imports: [PrismaModule],
  controllers: [OperatorController],
  providers: [OperatorService, OperatorGuard],
  exports: [OperatorService],
})
export class OperatorModule {}
