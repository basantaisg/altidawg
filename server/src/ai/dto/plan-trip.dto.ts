import {
  IsString,
  IsNumber,
  IsArray,
  Min,
  Max,
  ArrayMinSize,
} from "class-validator";

export class PlanTripDto {
  @IsString()
  city: string;

  @IsNumber()
  @Min(1)
  @Max(14)
  days: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  interests: string[];
}
