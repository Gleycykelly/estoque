import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxDate,
  MaxLength,
} from 'class-validator';
import { GeneroUsuario } from '../enum/genero-usuario.enum';
import { PermissaoUsuario } from '../enum/permissao-usuario.enum';
import { Enderecos } from 'src/enderecos/entities/endereco.entity';
import { Depositos } from 'src/depositos/entities/deposito.entity';
import { UsuariosTelefones } from 'src/usuarios-telefones/entities/usuario-telefone.entity';
import { Type } from 'class-transformer';

export class CreateUsuarioDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'E-mail inválido!' })
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

  @IsNotEmpty()
  @Type(() => Date)
  @MaxDate(
    () => {
      const hoje = new Date();
      const dataMinima = new Date(hoje);
      dataMinima.setFullYear(hoje.getFullYear() - 14);
      return dataMinima;
    },
    {
      message: () => `O operador deve ter no minimo 14 anos!`,
    },
  )
  dataNascimento: string;

  @IsEnum(GeneroUsuario, {
    message: 'Escolha o genêro do usuário entre as opções fornecidas',
  })
  generoUsuario: GeneroUsuario;

  @IsEnum(PermissaoUsuario, {
    message: 'Escolha a permissão do usuário entre as opções fornecidas',
  })
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
