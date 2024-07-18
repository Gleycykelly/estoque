import { IsOptional, IsString } from 'class-validator';

export class ObterParcialCategoriaDto {
  @IsString()
  @IsOptional()
  termoDePesquisa: string;
}
