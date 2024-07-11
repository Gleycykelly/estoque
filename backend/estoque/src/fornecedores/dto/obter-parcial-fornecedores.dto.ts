import { IsString } from 'class-validator';

export class ObterParcialFornecedorDto {
  @IsString()
  termoDePesquisa: string;
}
