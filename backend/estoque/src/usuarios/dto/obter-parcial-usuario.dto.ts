import { IsOptional, IsString } from 'class-validator';

export class ObterParcialUsuarioDto {
  @IsString()
  @IsOptional()
  termoDePesquisa: string;

  @IsString()
  @IsOptional()
  generoUsuario: string;

  @IsString()
  @IsOptional()
  permissaoUsuario: string;
}
