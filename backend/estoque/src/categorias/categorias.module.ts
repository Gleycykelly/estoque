import { Module } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Usuarios } from 'src/usuarios/entities/usuario.entity';
import { Enderecos } from 'src/enderecos/entities/endereco.entity';
import { Depositos } from 'src/depositos/entities/deposito.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { CategoriasRepository } from './categorias.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CategoriasRepository,
      Usuarios,
      Enderecos,
      Depositos,
    ]),
    JwtModule.register({
      secret: process.env.ENCRYPT_JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION,
      },
    }),
    AuthModule,
    UsuariosModule,
  ],
  controllers: [CategoriasController],
  providers: [CategoriasService, CategoriasRepository],
  exports: [CategoriasService],
})
export class CategoriasModule {}
