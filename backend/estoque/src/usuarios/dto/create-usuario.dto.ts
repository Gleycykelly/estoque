import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { GeneroUsuario } from '../enum/genero-usuario.enum';
import { PermissaoUsuario } from '../enum/permissao-usuario.enum';
import { Enderecos } from 'src/enderecos/entities/endereco.entity';
import { Depositos } from 'src/depositos/entities/deposito.entity';
import { UsuariosTelefones } from 'src/usuarios-telefones/entities/usuario-telefone.entity';

export class CreateUsuarioDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsString()
  @IsOptional()
  senha: string;

  @IsString()
  @MaxLength(150)
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(14)
  cpf: string;

  @IsString()
  @MaxLength(12)
  @IsNotEmpty()
  rg: string;

  @IsString()
  @IsNotEmpty()
  dataNascimento: string;

  @IsEnum(GeneroUsuario)
  generoUsuario: GeneroUsuario;

  @IsEnum(PermissaoUsuario)
  permissaoUsuario: PermissaoUsuario;

  @IsOptional()
  enderecos: Enderecos[];

  @IsOptional()
  depositos: Depositos[];

  @IsOptional()
  usuariosTelefones: UsuariosTelefones;

  @IsString()
  @IsOptional()
  novaSenha: string;
}
