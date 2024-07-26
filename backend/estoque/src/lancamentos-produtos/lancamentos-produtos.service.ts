import { ConflictException, Injectable } from '@nestjs/common';
import { CreateLancamentosProdutoDto } from './dto/create-lancamentos-produto.dto';
import { UpdateLancamentosProdutoDto } from './dto/update-lancamentos-produto.dto';
import { QueryRunner } from 'typeorm';
import { LocalizacoesDepositosService } from 'src/localizacoes-depositos/localizacoes-depositos.service';
import { ProdutosService } from 'src/produtos/produtos.service';
import { FornecedoresService } from 'src/fornecedores/fornecedores.service';
import { LancamentosProdutosRepository } from './lancamentos-produtos.repository';

@Injectable()
export class LancamentosProdutosService {
  constructor(
    private readonly repositorio: LancamentosProdutosRepository,
    private readonly localizacaoDepositoService: LocalizacoesDepositosService,
    private readonly produtoService: ProdutosService,
    private readonly fornecedorService: FornecedoresService,
  ) {}

  async create(createLancamentosProdutoDto: CreateLancamentosProdutoDto) {
    await this.loteJaCadastrado(createLancamentosProdutoDto.lote);

    createLancamentosProdutoDto.produto = await this.obtemEntidadeEstrangeira(
      createLancamentosProdutoDto.produto,
      this.produtoService,
    );

    createLancamentosProdutoDto.fornecedor =
      await this.obtemEntidadeEstrangeira(
        createLancamentosProdutoDto.fornecedor,
        this.fornecedorService,
      );

    createLancamentosProdutoDto.localizacaoDeposito =
      await this.obtemEntidadeEstrangeira(
        createLancamentosProdutoDto.localizacaoDeposito,
        this.localizacaoDepositoService,
      );

    return await this.repositorio.createLancamentosProduto(
      createLancamentosProdutoDto,
    );
  }

  async update(
    id: number,
    updateLancamentosProdutoDto: UpdateLancamentosProdutoDto,
  ) {
    const JaCadastrado = await this.loteJaCadastrado(
      updateLancamentosProdutoDto.lote,
      true,
    );

    if (JaCadastrado) {
      const loteAtual = await this.repositorio.obterPeloLote(
        updateLancamentosProdutoDto.lote,
      );

      if (loteAtual && loteAtual.id != id) {
        throw new ConflictException(
          `Lote ${updateLancamentosProdutoDto.lote} já cadastrado!`,
        );
      }
    }

    updateLancamentosProdutoDto.produto = await this.obtemEntidadeEstrangeira(
      updateLancamentosProdutoDto.produto,
      this.produtoService,
    );

    updateLancamentosProdutoDto.fornecedor =
      await this.obtemEntidadeEstrangeira(
        updateLancamentosProdutoDto.fornecedor,
        this.fornecedorService,
      );

    updateLancamentosProdutoDto.localizacaoDeposito =
      await this.obtemEntidadeEstrangeira(
        updateLancamentosProdutoDto.localizacaoDeposito,
        this.localizacaoDepositoService,
      );

    return await this.repositorio.updateLancamentosProduto(
      id,
      updateLancamentosProdutoDto,
    );
  }

  async findAll() {
    return await this.repositorio.obterTodos();
  }

  async findOne(id: number) {
    return await this.repositorio.obterPorId(id);
  }

  async remove(id: number, queryRunner?: QueryRunner) {
    try {
      return await this.repositorio.excluir(id, queryRunner);
    } catch (error) {
      throw new ConflictException(
        'Não foi possível excluir o lançamento do produto porque há movimentações associadas a ele.',
      );
    }
  }

  async loteJaCadastrado(lote: string, ehAtualizacao = false) {
    const jaExiste = await this.repositorio.existeLancamentoParaOLote(lote);

    if (jaExiste && !ehAtualizacao) {
      throw new ConflictException(`Já existe uma entrada para o lote ${lote}`);
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
    return await service.create({ ...entidade });
  }
}
