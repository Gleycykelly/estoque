import { Module } from '@nestjs/common';
import { ExcelService } from './excel.service';
import { ExcelController } from './excel.controller';
import { MovimentacoesModule } from 'src/movimentacoes/movimentacoes.module';

@Module({
  imports: [MovimentacoesModule],
  providers: [ExcelService],
  controllers: [ExcelController],
  exports: [ExcelService],
})
export class ExcelModule {}
