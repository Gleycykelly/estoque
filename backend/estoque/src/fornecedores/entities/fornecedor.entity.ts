import { Enderecos } from 'src/enderecos/entities/endereco.entity';
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

@Index('un_fornecedores_npj', ['cnpj'], { unique: true })
@Index('pk_fornecedores_id', ['id'], { unique: true })
@Entity('fornecedores', { schema: 'public' })
export class Fornecedores {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'cnpj', unique: true, length: 20 })
  cnpj: string;

  @Column('character varying', { name: 'razao_social', length: 150 })
  razaoSocial: string;

  @Column('character varying', { name: 'telefone', length: 20 })
  telefone: string;

  @ManyToOne(() => Enderecos, (enderecos) => enderecos.fornecedores)
  @JoinColumn([{ name: 'id_endereco', referencedColumnName: 'id' }])
  endereco: Enderecos;

  @OneToMany(
    () => LancamentosProdutos,
    (lancamentosProdutos) => lancamentosProdutos.fornecedor,
  )
  lancamentosProdutos: LancamentosProdutos[];
}
