import { IsOptional, IsString } from 'class-validator';

export class ObterParcialMarcaDto {
  @IsString()
  @IsOptional()
  termoDePesquisa: string;
}
