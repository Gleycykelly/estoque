import { IsOptional, IsString } from 'class-validator';

export class ObterParcialEstadosDto {
  @IsString()
  @IsOptional()
  termoDePesquisa: string;
}
