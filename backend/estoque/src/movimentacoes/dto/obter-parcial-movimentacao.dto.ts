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
  fornecedores: number[];

  @IsOptional()
  quantidadeMaiorQue: number;

  @IsOptional()
  quantidadeMenorQue: number;

  @IsOptional()
  diasParaVencer: number;

  @IsOptional()
  produtosVencidos: boolean;
}
