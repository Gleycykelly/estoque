import { Module } from '@nestjs/common';
import { MarcasService } from './marcas.service';
import { MarcasController } from './marcas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarcasRepository } from './marcas.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MarcasRepository])],
  controllers: [MarcasController],
  providers: [MarcasService, MarcasRepository],
  exports: [MarcasService],
})
export class MarcasModule {}
