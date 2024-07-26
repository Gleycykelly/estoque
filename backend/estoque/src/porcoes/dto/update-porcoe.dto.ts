import { PartialType } from '@nestjs/swagger';
import { CreatePorcoeDto } from './create-porcoe.dto';

export class UpdatePorcoeDto extends PartialType(CreatePorcoeDto) {}
