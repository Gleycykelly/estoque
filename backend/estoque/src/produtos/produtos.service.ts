import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { Produtos } from './entities/produto.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { CategoriasService } from 'src/categorias/categorias.service';
import { MarcasService } from 'src/marcas/marcas.service';
import { UnidadesMedidasService } from 'src/unidades_medidas/unidades_medidas.service';
import { ObterParcialProdutoDto } from './dto/obter-parcial-produto.dto';
import { PorcoesService } from 'src/porcoes/porcoes.service';

@Injectable()
export class ProdutosService {
  constructor(
    private readonly authService: AuthService,
    private readonly usuarioService: UsuariosService,
    private readonly categoriaService: CategoriasService,
    private readonly marcaService: MarcasService,
    private readonly unidadeMedidaService: UnidadesMedidasService,
    private readonly porcaoService: PorcoesService,
  ) {}
  @InjectRepository(Produtos)
  private readonly produtoRepository: Repository<Produtos>;

  async create(createProdutoDto: CreateProdutoDto, token: string) {
    await this.produtoJaCadastrado(createProdutoDto.codigoProduto);

    const decodedToken = await this.authService.checkToken(token);

    createProdutoDto.usuario = await this.usuarioService.findOne(
      decodedToken.id,
    );

    createProdutoDto.dataCadastro = new Date(Date.now()).toString();

    createProdutoDto.categoria = await this.obtemEntidadeEstrangeira(
      createProdutoDto.categoria,
      this.categoriaService,
    );

    createProdutoDto.unidadeMedida = await this.obtemEntidadeEstrangeira(
      createProdutoDto.unidadeMedida,
      this.unidadeMedidaService,
    );

    createProdutoDto.marca = await this.obtemEntidadeEstrangeira(
      createProdutoDto.marca,
      this.marcaService,
    );

    const produto = this.produtoRepository.create({
      ...createProdutoDto,
    });

    return this.produtoRepository.save(produto);
  }

  async update(id: number, updateProdutoDto: UpdateProdutoDto) {
    if (updateProdutoDto.porcoes && updateProdutoDto.porcoes.length > 0) {
      const porcoes = updateProdutoDto.porcoes;

      updateProdutoDto.porcoes = [];

      for (const porcao of porcoes) {
        updateProdutoDto.porcoes.push(
          await this.obtemEntidadeEstrangeira(porcao, this.porcaoService),
        );
      }
    }

    const JaCadastrado = await this.produtoJaCadastrado(
      updateProdutoDto.codigoProduto,
      true,
    );

    if (JaCadastrado) {
      const produtoAtual = await this.produtoRepository.findOne({
        where: { codigoProduto: updateProdutoDto.codigoProduto },
      });

      if (produtoAtual.id != id) {
        throw new ConflictException(
          `Já existe um produto cadastrado para o código de produto ${updateProdutoDto.codigoProduto}`,
        );
      }
    }

    const produto = await this.produtoRepository.preload({
      ...updateProdutoDto,
      id,
    });

    if (!produto) {
      throw new NotFoundException(`Nenhum produto encontrado para o id ${id}`);
    }

    return this.produtoRepository.save(produto);
  }

  async findAll() {
    return await this.produtoRepository.find({
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

  async findOne(id: number): Promise<Produtos> {
    return await this.produtoRepository.findOne({
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

  async obterParcial(
    obterParcialProdutoDto: ObterParcialProdutoDto,
  ): Promise<Produtos[]> {
    if (!obterParcialProdutoDto.termoDePesquisa) {
      return this.findAll();
    }
    return await this.produtoRepository
      .createQueryBuilder('produto')
      .where('LOWER(produto.codigoProduto) LIKE LOWER(:termo)', {
        termo: `%${obterParcialProdutoDto.termoDePesquisa}%`,
      })
      .orWhere('LOWER(produto.nome) LIKE LOWER(:termo)', {
        termo: `%${obterParcialProdutoDto.termoDePesquisa}%`,
      })
      .getMany();
  }

  async remove(id: number) {
    try {
      const produto = await this.findOne(id);

      return await this.produtoRepository.remove(produto);
    } catch (error) {
      throw new ConflictException(
        'Não foi possível excluir o produto porque há movimentações associadas a ele.',
      );
    }
  }

  async produtoJaCadastrado(codigoProduto: string, ehAtualizacao = false) {
    const jaExiste = await this.produtoRepository.count({
      where: { codigoProduto: codigoProduto },
    });

    if (jaExiste && !ehAtualizacao) {
      throw new ConflictException(
        `Já existe um produto cadastrado com o código ${codigoProduto}!`,
      );
    } else if (jaExiste) {
      return true;
    }

    return false;
  }

  private async obtemEntidadeEstrangeira(entidade: any, service: any) {
    if (entidade.id) {
      const entidadeBD = await service.findOne(entidade.id);
      return await service.update(entidadeBD.id, entidade);
    }
    return service.create({ ...entidade });
  }
}