import { Module } from '@nestjs/common';
import { MovimentacoesService } from './movimentacoes.service';
import { MovimentacoesController } from './movimentacoes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LancamentosProdutos } from 'src/lancamentos-produtos/entities/lancamento-produto.entity';
import { Usuarios } from 'src/usuarios/entities/usuario.entity';
import { LancamentosProdutosModule } from 'src/lancamentos-produtos/lancamentos-produtos.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { AuthModule } from 'src/auth/auth.module';
import { MovimentacoesRepository } from './movimentacoes.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MovimentacoesRepository,
      LancamentosProdutos,
      Usuarios,
    ]),
    LancamentosProdutosModule,
    UsuariosModule,
    AuthModule,
  ],
  controllers: [MovimentacoesController],
  providers: [MovimentacoesService, MovimentacoesRepository],
  exports: [MovimentacoesService],
})
export class MovimentacoesModule {}
