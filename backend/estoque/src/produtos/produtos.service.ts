import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { Produtos } from './entities/produto.entity';
import { AuthService } from 'src/auth/auth.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { CategoriasService } from 'src/categorias/categorias.service';
import { MarcasService } from 'src/marcas/marcas.service';
import { UnidadesMedidasService } from 'src/unidades_medidas/unidades_medidas.service';
import { ObterParcialProdutoDto } from './dto/obter-parcial-produto.dto';
import { PorcoesService } from 'src/porcoes/porcoes.service';
import { ProdutosRepository } from './produtos.repository';
import { Porcoes } from 'src/porcoes/entities/porcao.entity';

@Injectable()
export class ProdutosService {
  constructor(
    private readonly repositorio: ProdutosRepository,
    private readonly authService: AuthService,
    private readonly usuarioService: UsuariosService,
    private readonly categoriaService: CategoriasService,
    private readonly marcaService: MarcasService,
    private readonly unidadeMedidaService: UnidadesMedidasService,
    private readonly porcaoService: PorcoesService,
  ) {}

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

    if (createProdutoDto.marca) {
      createProdutoDto.marca = await this.obtemEntidadeEstrangeira(
        createProdutoDto.marca,
        this.marcaService,
      );
    }

    const produtoCadastrado =
      await this.repositorio.createProduto(createProdutoDto);

    if (createProdutoDto.porcoes && createProdutoDto.porcoes.length > 0) {
      const porcoes = createProdutoDto.porcoes;

      createProdutoDto.porcoes = [];

      for (const porcao of porcoes) {
        porcao.produto = produtoCadastrado;
        createProdutoDto.porcoes.push(
          await this.obtemEntidadeEstrangeira(porcao, this.porcaoService),
        );
      }
    }
    produtoCadastrado.porcoes = createProdutoDto.porcoes;
    return produtoCadastrado;
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
      const produtoAtual = await this.repositorio.obterPeloCodigoProduto(
        updateProdutoDto.codigoProduto,
      );

      if (produtoAtual && produtoAtual.id != id) {
        throw new ConflictException(
          `Já existe um produto cadastrado para o código de produto ${updateProdutoDto.codigoProduto}`,
        );
      }
    }

    return await this.repositorio.updateProduto(id, updateProdutoDto);
  }

  async findAll() {
    return await this.repositorio.obterTodos();
  }

  async findOne(id: number): Promise<Produtos> {
    return await this.repositorio.obterPorId(id);
  }

  async obterParcial(
    obterParcialProdutoDto: ObterParcialProdutoDto,
  ): Promise<Produtos[]> {
    return await this.repositorio.obterParcial(obterParcialProdutoDto);
  }

  async remove(id: number) {
    const queryRunner = this.repositorio.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const produto = await this.repositorio.obterPorId(id);

      if (!produto) {
        throw new NotFoundException(
          `Nenhuma produto encontrado para o id ${id}`,
        );
      }

      if (produto.porcoes == null || produto.porcoes.length < 1) {
        await this.repositorio.excluir(produto.id);
      }

      if (produto.porcoes.length >= 1) {
        queryRunner.manager.getRepository(Produtos);
        queryRunner.manager.getRepository(Porcoes);

        for (const porcao of produto.porcoes) {
          await this.porcaoService.remove(porcao.id, queryRunner);
        }
        await queryRunner.manager.remove(Produtos, produto);
        await queryRunner.commitTransaction();
      }
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new ConflictException('Não foi possível excluir o produto.');
    } finally {
      await queryRunner.release();
    }
  }

  async produtoJaCadastrado(codigoProduto: string, ehAtualizacao = false) {
    const jaExiste = await this.repositorio.existeProduto(codigoProduto);

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
