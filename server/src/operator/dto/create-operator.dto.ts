import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsPhoneNumber,
  IsString,
} from "class-validator";

export class CreateOperatorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumberString()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @IsEmail()
  email: string;
}
