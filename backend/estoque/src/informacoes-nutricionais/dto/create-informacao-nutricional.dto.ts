import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateInformacaoNutricionalDto {
  @IsString()
  @MaxLength(250)
  @IsOptional()
  alergenicos: string;

  @IsString()
  @MaxLength(250)
  @IsOptional()
  ingredientes: string;
}
