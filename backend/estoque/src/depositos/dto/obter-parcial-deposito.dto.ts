import { IsOptional, IsString } from 'class-validator';

export class ObterParcialDepositoDto {
  @IsString()
  @IsOptional()
  termoDePesquisa: string;

  @IsOptional()
  depositos: number[];
}
