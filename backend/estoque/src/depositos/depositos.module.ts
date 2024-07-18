import { Module, forwardRef } from '@nestjs/common';
import { DepositosService } from './depositos.service';
import { DepositosController } from './depositos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enderecos } from 'src/enderecos/entities/endereco.entity';
import { JwtModule } from '@nestjs/jwt';
import { Usuarios } from 'src/usuarios/entities/usuario.entity';
import { EnderecosModule } from 'src/enderecos/enderecos.module';
import { DepositosRepository } from './depositos.repository';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DepositosRepository, Enderecos, Usuarios]),
    JwtModule.register({
      secret: process.env.ENCRYPT_JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION,
      },
    }),
    EnderecosModule,
    forwardRef(() => UsuariosModule),
  ],
  controllers: [DepositosController],
  providers: [DepositosService, DepositosRepository],
  exports: [DepositosService],
})
export class DepositosModule {}
