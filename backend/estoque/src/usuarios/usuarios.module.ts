import { Module, forwardRef } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Enderecos } from 'src/enderecos/entities/endereco.entity';
import { Depositos } from 'src/depositos/entities/deposito.entity';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { EnderecosModule } from 'src/enderecos/enderecos.module';
import { DepositosModule } from 'src/depositos/depositos.module';
import { UsuariosTelefonesModule } from 'src/usuarios-telefones/usuarios-telefones.module';
import { UsuariosRepository } from './usuarios.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsuariosRepository, Enderecos, Depositos]),
    JwtModule.register({
      secret: process.env.ENCRYPT_JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION,
      },
    }),
    forwardRef(() => AuthModule),
    EnderecosModule,
    forwardRef(() => DepositosModule),
    UsuariosTelefonesModule,
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService, AuthService, UsuariosRepository],
  exports: [UsuariosService],
})
export class UsuariosModule {}
