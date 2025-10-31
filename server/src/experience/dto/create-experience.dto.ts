import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  IsArray,
  IsUrl,
  IsNumber,
} from "class-validator";

export class CreateExperienceDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsInt()
  @IsNotEmpty()
  priceNPR: number;

  @IsInt()
  @IsNotEmpty()
  maxGroupSize: number;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsUrl()
  @IsOptional()
  coverImageUrl?: string;

  @IsNumber()
  @IsOptional()
  geoLat?: number;

  @IsNumber()
  @IsOptional()
  geoLng?: number;

  @IsOptional()
  isActive?: boolean;
}
