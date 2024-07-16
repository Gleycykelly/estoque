import { IsOptional } from 'class-validator';
import { Depositos } from 'src/depositos/entities/deposito.entity';

export class DadosEmissaoExcelDto {
  @IsOptional()
  deposito: Depositos;
}
