import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Produtos } from './entities/produto.entity';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { ObterParcialProdutoDto } from './dto/obter-parcial-produto.dto';

@Injectable()
export class ProdutosRepository extends Repository<Produtos> {
  constructor(private dataSource: DataSource) {
    super(Produtos, dataSource.createEntityManager());
  }

  async createProduto(createProdutoDto: CreateProdutoDto): Promise<Produtos> {
    const produto = this.create({
      ...createProdutoDto,
    });

    return await this.save(produto);
  }

  async updateProduto(
    id: number,
    updateProdutoDto: UpdateProdutoDto,
  ): Promise<Produtos> {
    const produto = await this.preload({
      ...updateProdutoDto,
      id,
    });

    if (!produto) {
      throw new NotFoundException(`Nenhum produto encontrado para o id ${id}`);
    }

    return await this.save(produto);
  }

  async obterTodos(): Promise<Produtos[]> {
    return await this.find({
      relations: [
        'categoria',
        'usuario',
        'marca',
        'unidadeMedida',
        'porcoes',
        'porcoes.unidadeMedida',
        'porcoes.valorNutricional',
        'porcoes.informacaoNutricional',
        'porcoes.produto',
      ],
      order: {
        id: 'ASC',
        porcoes: { id: 'ASC' },
      },
    });
  }

  async obterPorId(id: number): Promise<Produtos> {
    return await this.findOne({
      relations: [
        'categoria',
        'usuario',
        'marca',
        'unidadeMedida',
        'porcoes',
        'porcoes.unidadeMedida',
        'porcoes.valorNutricional',
        'porcoes.informacaoNutricional',
        'porcoes.produto',
      ],
      where: { id },
    });
  }

  async existeProduto(codigoProduto: string) {
    return await this.count({
      where: { codigoProduto: codigoProduto },
    });
  }

  async obterPeloCodigoProduto(codigoProduto: string): Promise<Produtos> {
    return await this.findOne({
      where: { codigoProduto: codigoProduto },
    });
  }

  async obterParcial(
    obterParcialProdutoDto: ObterParcialProdutoDto,
  ): Promise<Produtos[]> {
    let query = await this.createQueryBuilder('produto')
      .leftJoinAndSelect('produto.categoria', 'categoria')
      .leftJoinAndSelect('produto.usuario', 'usuario')
      .leftJoinAndSelect('produto.marca', 'marca')
      .leftJoinAndSelect('produto.unidadeMedida', 'unidadeMedida')
      .leftJoinAndSelect('produto.porcoes', 'porcoes');

    if (obterParcialProdutoDto.termoDePesquisa) {
      query = query
        .where('LOWER(produto.codigoProduto) LIKE LOWER(:termo)', {
          termo: `%${obterParcialProdutoDto.termoDePesquisa}%`,
        })
        .orWhere('LOWER(produto.nome) LIKE LOWER(:termo)', {
          termo: `%${obterParcialProdutoDto.termoDePesquisa}%`,
        });
    }
    if (
      obterParcialProdutoDto.categorias &&
      obterParcialProdutoDto.categorias.length > 0
    ) {
      query = query.andWhere('categoria.id IN (:...categorias)', {
        categorias: obterParcialProdutoDto.categorias,
      });
    }

    if (
      obterParcialProdutoDto.marcas &&
      obterParcialProdutoDto.marcas.length > 0
    ) {
      query = query.andWhere('marca.id IN (:...marcas)', {
        marcas: obterParcialProdutoDto.marcas,
      });
    }

    if (
      obterParcialProdutoDto.operadores &&
      obterParcialProdutoDto.operadores.length > 0
    ) {
      query = query.andWhere('usuario.id IN (:...operadores)', {
        operadores: obterParcialProdutoDto.operadores,
      });
    }
    query.orderBy('produto.id', 'ASC');
    const result = await query.getMany();
    return result;
  }

  async excluir(id: number) {
    const produto = await this.obterPorId(id);

    return await this.remove(produto);
  }
}
