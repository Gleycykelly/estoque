import { Municipios } from 'src/municipios/entities/municipio.entity';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('pk_estados_id', ['id'], { unique: true })
@Index('un_estados_nome', ['nome'], { unique: true })
@Index('un_estados_uf', ['uf'], { unique: true })
@Entity('estados', { schema: 'public' })
export class Estados {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'codigo_uf' })
  codigoUf: number;

  @Column('character varying', {
    name: 'nome',
    nullable: true,
    unique: true,
    length: 50,
  })
  nome: string | null;

  @Column('character varying', { name: 'uf', unique: true, length: 2 })
  uf: string;

  @Column('integer', { name: 'regiao' })
  regiao: number;

  @OneToMany(() => Municipios, (municipios) => municipios.uf)
  municipios: Municipios[];
}
