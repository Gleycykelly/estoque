import { IsOptional } from 'class-validator';
import { Depositos } from 'src/depositos/entities/deposito.entity';

export class DadosEmissaoExcelDto {
  @IsOptional()
  deposito: Depositos;

  @IsOptional()
  dataInicial: string;

  @IsOptional()
  dataFinal: string;

  @IsOptional()
  tipoMovimentacao: string;
}
