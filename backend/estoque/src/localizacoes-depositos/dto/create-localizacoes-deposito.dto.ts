import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Depositos } from 'src/depositos/entities/deposito.entity';

export class CreateLocalizacoesDepositoDto {
  @IsString()
  @MaxLength(60)
  @IsNotEmpty()
  corredor: string;

  @IsString()
  @MaxLength(60)
  @IsNotEmpty()
  prateleira: string;

  @IsString()
  @MaxLength(250)
  @IsOptional()
  observacao: string;

  @IsNotEmptyObject()
  deposito: Depositos;
}
