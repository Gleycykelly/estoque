import { PartialType } from '@nestjs/swagger';
import { CreateValoresNutricionaiDto } from './create-valores-nutricionai.dto';

export class UpdateValoresNutricionaiDto extends PartialType(
  CreateValoresNutricionaiDto,
) {}
