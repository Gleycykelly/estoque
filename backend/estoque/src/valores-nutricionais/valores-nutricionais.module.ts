import { Module } from '@nestjs/common';
import { ValoresNutricionaisService } from './valores-nutricionais.service';
import { ValoresNutricionaisController } from './valores-nutricionais.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValoresNutricionaisRepository } from './valores-nutriconais.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ValoresNutricionaisRepository])],
  controllers: [ValoresNutricionaisController],
  providers: [ValoresNutricionaisService, ValoresNutricionaisRepository],
  exports: [ValoresNutricionaisService],
})
export class ValoresNutricionaisModule {}
