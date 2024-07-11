import { IsOptional, IsString } from 'class-validator';

export class ObterParcialMunicipiosDto {
  @IsString()
  @IsOptional()
  termo: string;

  @IsOptional()
  uf: string;
}
