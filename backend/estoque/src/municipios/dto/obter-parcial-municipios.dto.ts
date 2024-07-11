import { IsOptional, IsString } from 'class-validator';

export class ObterParcialMunicipiosDto {
  @IsString()
  @IsOptional()
  termoDePesquisa: string;

  @IsOptional()
  uf: string;
}
