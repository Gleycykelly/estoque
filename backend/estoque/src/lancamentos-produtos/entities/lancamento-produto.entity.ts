import { Fornecedores } from 'src/fornecedores/entities/fornecedor.entity';
import { LocalizacoesDepositos } from 'src/localizacoes-depositos/entities/localizacao-deposito.entity';
import { Movimentacoes } from 'src/movimentacoes/entities/movimentacao.entity';
import { Produtos } from 'src/produtos/entities/produto.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('pk_lancamentos_produtos_id', ['id'], { unique: true })
@Index('un_lancamentos_produtos_lote', ['lote'], { unique: true })
@Entity('lancamentos_produtos', { schema: 'public' })
export class LancamentosProdutos {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('date', { name: 'data_validade' })
  dataValidade: Date;

  @Column('character varying', { name: 'lote', unique: true, length: 100 })
  lote: string;

  @Column('numeric', { name: 'preco_custo', precision: 10, scale: 2 })
  precoCusto: number;

  @Column('numeric', { name: 'preco_venda', precision: 10, scale: 2 })
  precoVenda: number;

  @ManyToOne(
    () => Fornecedores,
    (fornecedores) => fornecedores.lancamentosProdutos,
  )
  @JoinColumn([{ name: 'id_fornecedor', referencedColumnName: 'id' }])
  fornecedor: Fornecedores;

  @ManyToOne(
    () => LocalizacoesDepositos,
    (localizacoesDepositos) => localizacoesDepositos.lancamentosProdutos,
  )
  @JoinColumn([{ name: 'id_localizacao_deposito', referencedColumnName: 'id' }])
  localizacaoDeposito: LocalizacoesDepositos;

  @ManyToOne(() => Produtos, (produtos) => produtos.lancamentosProdutos)
  @JoinColumn([{ name: 'id_produto', referencedColumnName: 'id' }])
  produto: Produtos;

  @OneToMany(
    () => Movimentacoes,
    (movimentacoes) => movimentacoes.lancamentoProduto,
  )
  movimentacoes: Movimentacoes[];
}
