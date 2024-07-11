import { Depositos } from 'src/depositos/entities/deposito.entity';
import { LancamentosProdutos } from 'src/lancamentos-produtos/entities/lancamento-produto.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('pk_localizacoes_depositos_id', ['id'], { unique: true })
@Entity('localizacoes_depositos', { schema: 'public' })
export class LocalizacoesDepositos {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'corredor', length: 60 })
  corredor: string;

  @Column('character varying', { name: 'prateleira', length: 60 })
  prateleira: string;

  @Column('character varying', {
    name: 'observacao',
    nullable: true,
    length: 250,
  })
  observacao: string | null;

  @OneToMany(
    () => LancamentosProdutos,
    (lancamentosProdutos) => lancamentosProdutos.localizacaoDeposito,
  )
  lancamentosProdutos: LancamentosProdutos[];

  @ManyToOne(() => Depositos, (depositos) => depositos.localizacoesDepositos)
  @JoinColumn([{ name: 'id_deposito', referencedColumnName: 'id' }])
  deposito: Depositos;
}
