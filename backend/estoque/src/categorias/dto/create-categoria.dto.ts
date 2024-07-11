import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
export class CreateCategoriaDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  descricao: string;
}
