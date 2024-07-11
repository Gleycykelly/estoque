import { IsNotEmpty, IsNotEmptyObject, IsString } from 'class-validator';
import { Enderecos } from 'src/enderecos/entities/endereco.entity';

export class CreateDepositoDto {
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @IsNotEmptyObject()
  endereco: Enderecos;
}
