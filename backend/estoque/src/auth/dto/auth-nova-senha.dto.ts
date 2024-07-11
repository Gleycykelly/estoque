import { IsJWT, IsString, MinLength } from 'class-validator';

export class AuthNovaSenhaDto {
  @IsString()
  @MinLength(6)
  senha: string;

  @IsJWT()
  token: string;
}
