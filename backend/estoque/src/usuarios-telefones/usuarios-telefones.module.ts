import { Module } from '@nestjs/common';
import { UsuariosTelefonesService } from './usuarios-telefones.service';
import { UsuariosTelefonesController } from './usuarios-telefones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosTelefonesRepository } from './usuarios-telefones.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UsuariosTelefonesRepository])],
  controllers: [UsuariosTelefonesController],
  providers: [UsuariosTelefonesService, UsuariosTelefonesRepository],
  exports: [UsuariosTelefonesService],
})
export class UsuariosTelefonesModule {}
