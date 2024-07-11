import { Porcoes } from 'src/porcoes/entities/porcao.entity';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('fk_valores_nutricionais_id', ['id'], { unique: true })
@Entity('valores_nutricionais', { schema: 'public' })
export class ValoresNutricionais {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('numeric', {
    name: 'valor_energetico',
    nullable: true,
    precision: 10,
    scale: 1,
  })
  valorEnergetico: number | null;

  @Column('numeric', {
    name: 'carboidratos',
    nullable: true,
    precision: 10,
    scale: 1,
  })
  carboidratos: number | null;

  @Column('numeric', {
    name: 'acucares_totais',
    nullable: true,
    precision: 10,
    scale: 1,
  })
  acucaresTotais: number | null;

  @Column('numeric', {
    name: 'acucares_adicionados',
    nullable: true,
    precision: 10,
    scale: 1,
  })
  acucaresAdicionados: number | null;

  @Column('numeric', {
    name: 'proteinas',
    nullable: true,
    precision: 10,
    scale: 1,
  })
  proteinas: number | null;

  @Column('numeric', {
    name: 'gorduras_totais',
    nullable: true,
    precision: 10,
    scale: 1,
  })
  gordurasTotais: number | null;

  @Column('numeric', {
    name: 'gorduras_saturadas',
    nullable: true,
    precision: 10,
    scale: 1,
  })
  gordurasSaturadas: number | null;

  @Column('numeric', {
    name: 'gorduras_trans',
    nullable: true,
    precision: 10,
    scale: 1,
  })
  gordurasTrans: number | null;

  @Column('numeric', {
    name: 'fribras_alimentares',
    nullable: true,
    precision: 10,
    scale: 1,
  })
  fribrasAlimentares: number | null;

  @Column('numeric', { name: 'sodio', nullable: true, precision: 5, scale: 1 })
  sodio: number | null;

  @OneToMany(() => Porcoes, (porcoes) => porcoes.valorNutricional)
  porcoes: Porcoes[];
}
