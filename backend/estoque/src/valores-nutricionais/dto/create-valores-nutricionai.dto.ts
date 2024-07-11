import { IsDecimal, IsOptional } from 'class-validator';

export class CreateValoresNutricionaiDto {
  @IsOptional()
  @IsDecimal({ decimal_digits: '1' })
  valorEnergetico: number;

  @IsOptional()
  @IsDecimal({ decimal_digits: '1' })
  carboidratos: number;

  @IsOptional()
  @IsDecimal({ decimal_digits: '1' })
  acucaresTotais: number;

  @IsOptional()
  @IsDecimal({ decimal_digits: '1' })
  acucaresAdicionados: number;

  @IsOptional()
  @IsDecimal({ decimal_digits: '1' })
  proteinas: number;

  @IsOptional()
  @IsDecimal({ decimal_digits: '1' })
  gordurasTotais: number;

  @IsOptional()
  @IsDecimal({ decimal_digits: '1' })
  gordurasSaturadas: number;

  @IsOptional()
  @IsDecimal({ decimal_digits: '1' })
  gordurasTrans: number;

  @IsOptional()
  @IsDecimal({ decimal_digits: '1' })
  fribrasAlimentares: number;

  @IsOptional()
  @IsDecimal({ decimal_digits: '1' })
  sodio: number;
}
