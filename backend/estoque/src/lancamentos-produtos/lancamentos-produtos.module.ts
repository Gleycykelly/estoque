import { Module } from '@nestjs/common';
import { LancamentosProdutosService } from './lancamentos-produtos.service';
import { LancamentosProdutosController } from './lancamentos-produtos.controller';
import { LancamentosProdutos } from './entities/lancamento-produto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produtos } from 'src/produtos/entities/produto.entity';
import { Fornecedores } from 'src/fornecedores/entities/fornecedor.entity';
import { LocalizacoesDepositos } from 'src/localizacoes-depositos/entities/localizacao-deposito.entity';
import { ProdutosModule } from 'src/produtos/produtos.module';
import { LocalizacoesDepositosModule } from 'src/localizacoes-depositos/localizacoes-depositos.module';
import { FornecedoresModule } from 'src/fornecedores/fornecedores.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LancamentosProdutos,
      Produtos,
      Fornecedores,
      LocalizacoesDepositos,
    ]),
    ProdutosModule,
    LocalizacoesDepositosModule,
    FornecedoresModule,
  ],
  controllers: [LancamentosProdutosController],
  providers: [LancamentosProdutosService],
  exports: [LancamentosProdutosService],
})
export class LancamentosProdutosModule {}
