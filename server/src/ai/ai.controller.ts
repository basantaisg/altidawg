import {
  Controller,
  Post,
  Body,
  HttpCode,
  UsePipes,
  ValidationPipe,
  Logger,
  BadRequestException,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AiService } from "./ai.service";
import { PlanTripDto } from "./dto/plan-trip.dto";
import { TripPlan, EnrichResult } from "./types";
import { EnrichExperienceDto } from "./dto/enrich-experience.dto";

@ApiTags("AI Services")
@Controller("/v1/ai")
@UsePipes(new ValidationPipe({ transform: true }))
export class AiController {
  private readonly logger = new Logger(AiController.name);

  constructor(private readonly aiService: AiService) {}

  @Post("/plan-trip")
  @HttpCode(200)
  @ApiOperation({ summary: "Generate AI-powered travel itinerary" })
  @ApiResponse({
    status: 200,
    description: "Returns a detailed trip plan with daily activities",
  })
  @ApiResponse({ status: 400, description: "Invalid input parameters" })
  async planTrip(@Body() dto: PlanTripDto): Promise<TripPlan> {
    try {
      this.logger.debug(`Planning trip for ${dto.city} (${dto.days} days)`);
      if (!dto.city) {
        throw new BadRequestException("City is required");
      }
      return await this.aiService.planTrip(dto.city, dto.days, dto.interests);
    } catch (error: any) {
      this.logger.error(`Trip planning failed: ${error.message}`);
      throw new BadRequestException(
        error.message || "Failed to generate trip plan"
      );
    }
  }

  @Post("/enrich-experience")
  @HttpCode(200)
  @ApiOperation({
    summary: "Enrich experience with AI-generated tags and summary",
  })
  @ApiResponse({
    status: 200,
    description: "Returns AI-generated tags and summary for the experience",
  })
  @ApiResponse({ status: 400, description: "Invalid input parameters" })
  async enrichExperience(
    @Body() dto: EnrichExperienceDto
  ): Promise<EnrichResult> {
    try {
      this.logger.debug(`Enriching experience description`);
      return await this.aiService.enrichExperience(dto.description);
    } catch (error: any) {
      this.logger.error(`Experience enrichment failed: ${error.message}`);
      throw new BadRequestException(
        error.message || "Failed to enrich experience"
      );
    }
  }
}
