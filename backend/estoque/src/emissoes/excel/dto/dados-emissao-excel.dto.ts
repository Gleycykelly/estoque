import { IsNotEmptyObject } from 'class-validator';
import { Depositos } from 'src/depositos/entities/deposito.entity';

export class DadosEmissaoExcelDto {
  @IsNotEmptyObject()
  deposito: Depositos;
}
