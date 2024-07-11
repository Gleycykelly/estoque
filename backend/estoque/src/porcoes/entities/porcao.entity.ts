import { InformacoesNutricionais } from 'src/informacoes-nutricionais/entities/informacao-nutricional.entity';
import { Produtos } from 'src/produtos/entities/produto.entity';
import { UnidadesMedidas } from 'src/unidades_medidas/entities/unidades_medida.entity';
import { ValoresNutricionais } from 'src/valores-nutricionais/entities/valor-nutricional.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('pk_porcoes_id', ['id'], { unique: true })
@Entity('porcoes', { schema: 'public' })
export class Porcoes {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('numeric', { name: 'porcao', precision: 5, scale: 2 })
  porcao: string;

  @ManyToOne(
    () => InformacoesNutricionais,
    (informacoesNutricionais) => informacoesNutricionais.porcoes,
  )
  @JoinColumn([
    { name: 'id_informacao_nutricional', referencedColumnName: 'id' },
  ])
  informacaoNutricional: InformacoesNutricionais;

  @ManyToOne(() => Produtos, (produtos) => produtos.porcoes)
  @JoinColumn([{ name: 'id_produto', referencedColumnName: 'id' }])
  produto: Produtos;

  @ManyToOne(
    () => UnidadesMedidas,
    (unidadesMedidas) => unidadesMedidas.porcoes,
  )
  @JoinColumn([{ name: 'id_unidade_medida', referencedColumnName: 'id' }])
  unidadeMedida: UnidadesMedidas;

  @ManyToOne(
    () => ValoresNutricionais,
    (valoresNutricionais) => valoresNutricionais.porcoes,
  )
  @JoinColumn([{ name: 'id_valor_nutricional', referencedColumnName: 'id' }])
  valorNutricional: ValoresNutricionais;
}
