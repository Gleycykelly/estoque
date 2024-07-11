import { LancamentosProdutos } from 'src/lancamentos-produtos/entities/lancamento-produto.entity';
import { Usuarios } from 'src/usuarios/entities/usuario.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('pk_movimentacoes_id', ['id'], { unique: true })
@Entity('movimentacoes', { schema: 'public' })
export class Movimentacoes {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('timestamp without time zone', {
    name: 'data_movimentacao',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dataMovimentacao: Date;

  @Column('integer', { name: 'quantidade' })
  quantidade: number;

  @Column('enum', { name: 'tipo_movimentacao', enum: ['Saída', 'Entrada'] })
  tipoMovimentacao: 'Saída' | 'Entrada';

  @ManyToOne(
    () => LancamentosProdutos,
    (lancamentosProdutos) => lancamentosProdutos.movimentacoes,
  )
  @JoinColumn([{ name: 'id_lancamento_produto', referencedColumnName: 'id' }])
  lancamentoProduto: LancamentosProdutos;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.movimentacoes)
  @JoinColumn([{ name: 'id_usuario', referencedColumnName: 'id' }])
  usuario: Usuarios;
}
