import { Module } from '@nestjs/common';
import { InformacoesNutricionaisService } from './informacoes-nutricionais.service';
import { InformacoesNutricionaisController } from './informacoes-nutricionais.controller';
import { InformacoesNutricionais } from './entities/informacao-nutricional.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([InformacoesNutricionais])],
  controllers: [InformacoesNutricionaisController],
  providers: [InformacoesNutricionaisService],
  exports: [InformacoesNutricionaisService],
})
export class InformacoesNutricionaisModule {}
