import { Produtos } from 'src/produtos/entities/produto.entity';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('un_categorias_descricao', ['descricao'], { unique: true })
@Index('pk_categorias_id', ['id'], { unique: true })
@Entity('categorias', { schema: 'public' })
export class Categorias {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'descricao', unique: true, length: 100 })
  descricao: string;

  @OneToMany(() => Produtos, (produtos) => produtos.categoria)
  produtos: Produtos[];
}
