import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
