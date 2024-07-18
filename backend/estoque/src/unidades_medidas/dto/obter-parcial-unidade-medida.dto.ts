import { IsOptional, IsString } from 'class-validator';

export class ObterParcialUnidadeMedidaDto {
  @IsString()
  @IsOptional()
  termoDePesquisa: string;
}
