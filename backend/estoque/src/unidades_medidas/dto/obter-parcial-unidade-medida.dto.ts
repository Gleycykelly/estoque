import { IsString } from 'class-validator';

export class ObterParcialUnidadeMedidaDto {
  @IsString()
  termoDePesquisa: string;
}
