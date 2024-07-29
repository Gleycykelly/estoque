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

  @IsNumber(null, {
    message: 'Preencha o campo de número apenas com valores númericos',
  })
  numero: number;

  @IsNumber(null, {
    message: 'Preencha o campo de lote apenas com valores númericos',
  })
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
