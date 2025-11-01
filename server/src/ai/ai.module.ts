import { Module } from "@nestjs/common";
import { AiController } from "./ai.controller";
import { AiService } from "./ai.service";
import { PrismaService } from "src/prisma/prisma.service";
import { ExperienceService } from "src/experience/experience.service";

@Module({
  controllers: [AiController],
  providers: [AiService, PrismaService, ExperienceService],
  exports: [AiService],
})
export class AiModule {}
