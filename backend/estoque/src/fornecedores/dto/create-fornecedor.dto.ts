import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  MaxLength,
} from 'class-validator';
import { CreateEnderecoDto } from 'src/enderecos/dto/create-endereco.dto';

export class CreateFornecedoreDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  cnpj: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  razaoSocial: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  telefone: string;

  @IsNotEmptyObject()
  endereco: CreateEnderecoDto;
}
