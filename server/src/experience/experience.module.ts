import { Module } from "@nestjs/common";
import { ExperienceController } from "./experience.controller";
import { ExperienceService } from "./experience.service";
import { OperatorGuard } from "../operator/operator.guard";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
  controllers: [ExperienceController],
  providers: [ExperienceService, PrismaService, OperatorGuard],
  exports: [ExperienceService],
})
export class ExperienceModule {}
