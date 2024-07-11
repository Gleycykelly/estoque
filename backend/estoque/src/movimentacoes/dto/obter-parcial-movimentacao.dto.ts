import { IsString } from 'class-validator';

export class ObterParcialMovimentacaoDto {
  @IsString()
  termoDePesquisa: string;
}
