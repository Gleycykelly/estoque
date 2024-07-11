import { Porcoes } from 'src/porcoes/entities/porcao.entity';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('pk_informacoes_nutricionais_id', ['id'], { unique: true })
@Entity('informacoes_nutricionais', { schema: 'public' })
export class InformacoesNutricionais {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', {
    name: 'alergenicos',
    nullable: true,
    length: 250,
  })
  alergenicos: string | null;

  @Column('character varying', {
    name: 'ingredientes',
    nullable: true,
    length: 250,
  })
  ingredientes: string | null;

  @OneToMany(() => Porcoes, (porcoes) => porcoes.informacaoNutricional)
  porcoes: Porcoes[];
}
