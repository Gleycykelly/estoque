import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUnidadesMedidaDto {
  @IsString()
  @MaxLength(4)
  @IsNotEmpty()
  sigla: string;

  @IsString()
  @MaxLength(250)
  descricao: string;
}
