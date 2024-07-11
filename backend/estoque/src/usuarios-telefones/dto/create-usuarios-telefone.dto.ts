import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateUsuariosTelefoneDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  telefonePrincipal: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  telefone: string;

  @IsNotEmptyObject()
  usuario: {
    id: number;
  };
}
