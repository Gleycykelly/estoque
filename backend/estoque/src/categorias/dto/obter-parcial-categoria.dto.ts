import { IsString } from 'class-validator';

export class ObterParcialCategoriaDto {
  @IsString()
  termoDePesquisa: string;
}
