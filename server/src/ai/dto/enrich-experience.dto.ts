import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class EnrichExperienceDto {
  @ApiProperty({
    description:
      "Full text description of the travel experience to enrich with AI tags and summary",
    example:
      "A scenic sunrise hike to Sarangkot followed by breakfast overlooking Pokhara valley.",
  })
  @IsString()
  @MinLength(10, { message: "Description must be at least 10 characters long" })
  description: string;
}
