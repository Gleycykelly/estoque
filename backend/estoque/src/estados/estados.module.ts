import { Module } from '@nestjs/common';
import { EstadosService } from './estados.service';
import { EstadosController } from './estados.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadosRepository } from './estados.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EstadosRepository])],
  controllers: [EstadosController],
  providers: [EstadosService, EstadosRepository],
})
export class EstadosModule {}
