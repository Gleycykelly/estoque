import { IsOptional, IsString } from 'class-validator';

export class ObterParcialMovimentacaoDto {
  @IsString()
  @IsOptional()
  termoDePesquisa: string;

  @IsOptional()
  operadores: number[];

  @IsOptional()
  tipoMovimentacao: string;

  @IsOptional()
  produtos: number[];

  @IsOptional()
  depositos: number[];

  @IsOptional()
  naoEhAdministrador: boolean;

  @IsOptional()
  fornecedores: number[];

  @IsOptional()
  diasParaVencer: number;

  @IsOptional()
  produtosVencidos: boolean;
}
