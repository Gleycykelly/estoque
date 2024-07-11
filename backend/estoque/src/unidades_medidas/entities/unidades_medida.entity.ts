import { Porcoes } from 'src/porcoes/entities/porcao.entity';
import { Produtos } from 'src/produtos/entities/produto.entity';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('un_unidades_medidas_descricao', ['descricao'], { unique: true })
@Index('pk_unidades_medidas_id', ['id'], { unique: true })
@Index('un_unidades_medidas_sigla', ['sigla'], { unique: true })
@Entity('unidades_medidas', { schema: 'public' })
export class UnidadesMedidas {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'sigla', unique: true, length: 4 })
  sigla: string;

  @Column('character varying', {
    name: 'descricao',
    nullable: true,
    unique: true,
    length: 250,
  })
  descricao: string | null;

  @OneToMany(() => Porcoes, (porcoes) => porcoes.unidadeMedida)
  porcoes: Porcoes[];

  @OneToMany(() => Produtos, (produtos) => produtos.unidadeMedida)
  produtos: Produtos[];
}
