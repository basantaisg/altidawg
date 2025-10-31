import { IsNotEmpty, IsString, IsInt, Min, IsOptional } from "class-validator";

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  slotId: string;

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @IsInt()
  @Min(1)
  pax: number;

  @IsString()
  @IsOptional()
  note?: string;
}
