import { Controller, Post, Body } from "@nestjs/common";
import { AiService } from "./ai.service";

@Controller("/v1/ai")
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post("/plan-trip")
  async planTrip(
    @Body("city") city: string,
    @Body("days") days: number,
    @Body("interests") interests: string[]
  ) {
    return this.aiService.planTrip(city, days, interests);
  }
}
