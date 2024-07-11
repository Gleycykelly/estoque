import { Enderecos } from 'src/enderecos/entities/endereco.entity';
import { Estados } from 'src/estados/entities/estado.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('pk_municipios_id', ['id'], { unique: true })
@Entity('municipios', { schema: 'public' })
export class Municipios {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'codigo' })
  codigo: number;

  @Column('character varying', { name: 'nome', length: 255 })
  nome: string;

  @OneToMany(() => Enderecos, (enderecos) => enderecos.municipio)
  enderecos: Enderecos[];

  @ManyToOne(() => Estados, (estados) => estados.municipios)
  @JoinColumn([{ name: 'uf', referencedColumnName: 'uf' }])
  uf: Estados;
}
