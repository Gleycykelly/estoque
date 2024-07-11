import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateMarcaDto {
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  descricao: string;
}
