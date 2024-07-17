import { Module } from '@nestjs/common';
import { InformacoesNutricionaisService } from './informacoes-nutricionais.service';
import { InformacoesNutricionaisController } from './informacoes-nutricionais.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InformacoesNutricionaisRepository } from './informacoes-nutricionais.repository';

@Module({
  imports: [TypeOrmModule.forFeature([InformacoesNutricionaisRepository])],
  controllers: [InformacoesNutricionaisController],
  providers: [
    InformacoesNutricionaisService,
    InformacoesNutricionaisRepository,
  ],
  exports: [InformacoesNutricionaisService],
})
export class InformacoesNutricionaisModule {}
