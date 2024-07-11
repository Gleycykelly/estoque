import { Module } from '@nestjs/common';
import { ValoresNutricionaisService } from './valores-nutricionais.service';
import { ValoresNutricionaisController } from './valores-nutricionais.controller';
import { ValoresNutricionais } from './entities/valor-nutricional.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ValoresNutricionais])],
  controllers: [ValoresNutricionaisController],
  providers: [ValoresNutricionaisService],
  exports: [ValoresNutricionaisService],
})
export class ValoresNutricionaisModule {}
