import { IsOptional } from 'class-validator';

export class DadosEmissaoExcelDto {
  @IsOptional()
  dataInicial: string;

  @IsOptional()
  dataFinal: string;

  @IsOptional()
  tipoMovimentacao: string;

  @IsOptional()
  fornecedores: number[];

  @IsOptional()
  depositos: number[];

  @IsOptional()
  quantidadeMaiorQue: number;

  @IsOptional()
  quantidadeMenorQue: number;

  @IsOptional()
  diasParaVencer: number;

  @IsOptional()
  produtosVencidos: boolean;
}
