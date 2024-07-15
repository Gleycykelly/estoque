// emissions/emissions.module.ts

import { Module } from '@nestjs/common';
import { ExcelModule } from './excel/excel.module';
import { PdfModule } from './pdf/pdf.module';

@Module({
  imports: [ExcelModule, PdfModule],
})
export class EmissionsModule {}
