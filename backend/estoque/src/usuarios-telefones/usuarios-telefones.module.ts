import { Module } from '@nestjs/common';
import { UsuariosTelefonesService } from './usuarios-telefones.service';
import { UsuariosTelefonesController } from './usuarios-telefones.controller';
import { UsuariosTelefones } from './entities/usuario-telefone.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UsuariosTelefones])],
  controllers: [UsuariosTelefonesController],
  providers: [UsuariosTelefonesService],
})
export class UsuariosTelefonesModule {}
