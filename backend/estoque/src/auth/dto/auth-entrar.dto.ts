import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthEntrarDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  senha: string;
}
