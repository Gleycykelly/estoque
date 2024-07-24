import { Categorias } from 'src/categorias/entities/categoria.entity';
import { LancamentosProdutos } from 'src/lancamentos-produtos/entities/lancamento-produto.entity';
import { Marcas } from 'src/marcas/entities/marca.entity';
import { Porcoes } from 'src/porcoes/entities/porcao.entity';
import { UnidadesMedidas } from 'src/unidades_medidas/entities/unidades_medida.entity';
import { Usuarios } from 'src/usuarios/entities/usuario.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('un_produtos_codigo_produto', ['codigoProduto'], { unique: true })
@Index('pk_produtos_id_produto', ['id'], { unique: true })
@Entity('produtos', { schema: 'public' })
export class Produtos {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', {
    name: 'codigo_produto',
    unique: true,
    length: 60,
  })
  codigoProduto: string;

  @Column('character varying', { name: 'nome', length: 100 })
  nome: string;

  @Column('timestamp without time zone', {
    name: 'data_cadastro',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dataCadastro: Date;

  @Column('character varying', {
    name: 'descricao',
    nullable: true,
    length: 250,
  })
  descricao: string | null;

  @OneToMany(
    () => LancamentosProdutos,
    (lancamentosProdutos) => lancamentosProdutos.produto,
    { cascade: true },
  )
  lancamentosProdutos: LancamentosProdutos[];

  @OneToMany(() => Porcoes, (porcoes) => porcoes.produto)
  porcoes: Porcoes[];

  @ManyToOne(() => Categorias, (categorias) => categorias.produtos)
  @JoinColumn([{ name: 'id_categoria', referencedColumnName: 'id' }])
  categoria: Categorias;

  @ManyToOne(() => Marcas, (marcas) => marcas.produtos)
  @JoinColumn([{ name: 'id_marca', referencedColumnName: 'id' }])
  marca: Marcas;

  @ManyToOne(
    () => UnidadesMedidas,
    (unidadesMedidas) => unidadesMedidas.produtos,
  )
  @JoinColumn([{ name: 'id_unidade_medida', referencedColumnName: 'id' }])
  unidadeMedida: UnidadesMedidas;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.produtos)
  @JoinColumn([{ name: 'id_usuario', referencedColumnName: 'id' }])
  usuario: Usuarios;
}
