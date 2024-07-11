import { IsString } from 'class-validator';

export class ObterParcialProdutoDto {
  @IsString()
  termoDePesquisa: string;
}
