import {
  IsArray,
  IsDateString,
  IsInt,
  Min,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class SlotInputDto {
  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsInt()
  @Min(1)
  seatsTotal: number;
}

export class BulkCreateSlotsDto extends Array<SlotInputDto> {}

export class BulkCreateSlotsBody {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SlotInputDto)
  slots: SlotInputDto[];
}
