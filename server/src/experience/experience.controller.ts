import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  Patch,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ExperienceService } from "./experience.service";
import { CreateExperienceDto } from "./dto/create-experience.dto";
import { UpdateExperienceDto } from "./dto/update-experience.dto";
import { OperatorGuard } from "../operator/operator.guard";

@Controller()
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  // -------- PUBLIC ROUTES --------
  @Get("/v1/public/experiences")
  async listPublic(@Query("city") city?: string, @Query("tag") tag?: string) {
    return this.experienceService.listPublic(city, tag);
  }

  @Get("/v1/public/experiences/:id")
  async getOne(@Param("id") id: string) {
    return this.experienceService.getOne(id);
  }

  // -------- OPERATOR ROUTES --------
  @UseGuards(OperatorGuard)
  @Post("/v1/operator/experiences")
  async create(@Body() dto: CreateExperienceDto, @Req() req) {
    return this.experienceService.create(dto, req.operator.id);
  }

  @UseGuards(OperatorGuard)
  @Patch("/v1/operator/experiences/:id")
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateExperienceDto,
    @Req() req
  ) {
    return this.experienceService.update(id, dto, req.operator.id);
  }
}
