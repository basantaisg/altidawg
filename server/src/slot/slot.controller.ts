import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  UseGuards,
  Req,
  ParseIntPipe,
} from "@nestjs/common";
import { SlotService } from "./slot.service";
import { OperatorGuard } from "../operator/operator.guard";
import { BulkCreateSlotsBody } from "./dto/bulk-create-slots.dto";

@Controller()
export class SlotController {
  constructor(private readonly slotService: SlotService) {}

  // -------- PUBLIC --------
  @Get("/v1/public/experiences/:id/slots")
  async list(@Param("id") experienceId: string, @Query("days") days?: string) {
    const daysAhead = days ? Math.max(1, Math.min(60, parseInt(days))) : 14; // clamp 1..60
    return this.slotService.listForExperience(experienceId, daysAhead);
  }

  // -------- OPERATOR (protected) --------
  @UseGuards(OperatorGuard)
  @Post("/v1/operator/experiences/:id/slots/bulk")
  async bulkCreate(
    @Param("id") experienceId: string,
    @Body() slots: BulkCreateSlotsBody, // expects an array: [{startTime, endTime, seatsTotal}, ...]
    @Req() req: any
  ) {
    return this.slotService.bulkCreate(experienceId, req.operator.id, slots);
  }
}
