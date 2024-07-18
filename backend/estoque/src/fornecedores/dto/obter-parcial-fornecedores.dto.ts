import { IsOptional, IsString } from 'class-validator';

export class ObterParcialFornecedorDto {
  @IsString()
  @IsOptional()
  termoDePesquisa: string;
}
