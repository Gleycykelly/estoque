import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateEnderecoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  logradouro: string;

  @IsNumber()
  numero: number;

  @IsNumber()
  lote: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  bairro: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  cep: string;

  @IsString()
  @MaxLength(250)
  complemento: string;

  @IsNotEmptyObject()
  municipio: {
    id: number;
  };
}
