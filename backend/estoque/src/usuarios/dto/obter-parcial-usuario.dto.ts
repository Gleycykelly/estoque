import { IsString } from 'class-validator';

export class ObterParcialUsuarioDto {
  @IsString()
  termoDePesquisa: string;
}
