import { Module } from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import { ProdutosController } from './produtos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categorias } from 'src/categorias/entities/categoria.entity';
import { UnidadesMedidas } from 'src/unidades_medidas/entities/unidades_medida.entity';
import { Marcas } from 'src/marcas/entities/marca.entity';
import { Usuarios } from 'src/usuarios/entities/usuario.entity';
import { JwtModule } from '@nestjs/jwt';
import { Enderecos } from 'src/enderecos/entities/endereco.entity';
import { Depositos } from 'src/depositos/entities/deposito.entity';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { CategoriasModule } from 'src/categorias/categorias.module';
import { MarcasModule } from 'src/marcas/marcas.module';
import { UnidadesMedidasModule } from 'src/unidades_medidas/unidades_medidas.module';
import { AuthModule } from 'src/auth/auth.module';
import { PorcoesModule } from 'src/porcoes/porcoes.module';
import { ProdutosRepository } from './produtos.repository';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.ENCRYPT_JWT_SECRET,
    }),
    TypeOrmModule.forFeature([
      ProdutosRepository,
      Categorias,
      UnidadesMedidas,
      Marcas,
      Usuarios,
      Enderecos,
      Depositos,
    ]),
    UsuariosModule,
    CategoriasModule,
    MarcasModule,
    UnidadesMedidasModule,
    AuthModule,
    PorcoesModule,
  ],
  controllers: [ProdutosController],
  providers: [ProdutosService, ProdutosRepository],
  exports: [ProdutosService],
})
export class ProdutosModule {}
