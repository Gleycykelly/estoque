import { IsOptional, IsString } from 'class-validator';

export class ObterParcialProdutoDto {
  @IsString()
  @IsOptional()
  termoDePesquisa: string;

  @IsOptional()
  categorias: number[];

  @IsOptional()
  marcas: number[];

  @IsOptional()
  operadores: number[];
}
