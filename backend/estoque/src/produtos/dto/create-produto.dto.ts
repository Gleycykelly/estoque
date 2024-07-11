import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Categorias } from 'src/categorias/entities/categoria.entity';
import { Marcas } from 'src/marcas/entities/marca.entity';
import { Porcoes } from 'src/porcoes/entities/porcao.entity';
import { UnidadesMedidas } from 'src/unidades_medidas/entities/unidades_medida.entity';
import { Usuarios } from 'src/usuarios/entities/usuario.entity';

export class CreateProdutoDto {
  @IsString()
  @MaxLength(60)
  @IsNotEmpty()
  codigoProduto: string;

  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsOptional()
  dataCadastro: string;

  @IsString()
  @MaxLength(250)
  @IsOptional()
  descricao: string;

  @IsNotEmptyObject()
  categoria: Categorias;

  @IsNotEmptyObject()
  unidadeMedida: UnidadesMedidas;

  @IsOptional()
  marca: Marcas;

  @IsNotEmptyObject()
  @IsOptional()
  usuario: Usuarios;

  @IsOptional()
  porcoes: Porcoes[];
}
