import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { OperatorService } from "./operator.service.js";
import { CreateOperatorDto } from "./dto/create-operator.dto.js";
import { OperatorGuard } from "./operator.guard.js";

@Controller()
export class OperatorController {
  constructor(private readonly operatorService: OperatorService) {}

  @Post("/dev/seed/operator")
  async createOperator(@Body() dto: CreateOperatorDto) {
    return this.operatorService.createOperator(dto);
  }

  @UseGuards(OperatorGuard)
  @Get("/v1/operator/analytics")
  async getAnalytics(@Req() req) {
    return this.operatorService.getAnalytics(req.operator.id);
  }
}
