import { IsString } from 'class-validator';

export class ObterParcialDepositoDto {
  @IsString()
  termoDePesquisa: string;
}
