import { Produtos } from 'src/produtos/entities/produto.entity';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('un_marcas_descricao', ['descricao'], { unique: true })
@Index('fk_marcas_id', ['id'], { unique: true })
@Entity('marcas', { schema: 'public' })
export class Marcas {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'descricao', unique: true, length: 100 })
  descricao: string;

  @OneToMany(() => Produtos, (produtos) => produtos.marca)
  produtos: Produtos[];
}
