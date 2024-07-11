import { PartialType } from '@nestjs/swagger';
import { CreateFornecedoreDto } from './create-fornecedor.dto';

export class UpdateFornecedoreDto extends PartialType(CreateFornecedoreDto) {}
