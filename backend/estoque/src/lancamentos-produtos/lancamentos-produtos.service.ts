import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLancamentosProdutoDto } from './dto/create-lancamentos-produto.dto';
import { UpdateLancamentosProdutoDto } from './dto/update-lancamentos-produto.dto';
import { LancamentosProdutos } from './entities/lancamento-produto.entity';
import { QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LocalizacoesDepositosService } from 'src/localizacoes-depositos/localizacoes-depositos.service';
import { ProdutosService } from 'src/produtos/produtos.service';
import { FornecedoresService } from 'src/fornecedores/fornecedores.service';

@Injectable()
export class LancamentosProdutosService {
  constructor(
    private readonly localizacaoDepositoService: LocalizacoesDepositosService,
    private readonly produtoService: ProdutosService,
    private readonly fornecedorService: FornecedoresService,
  ) {}
  @InjectRepository(LancamentosProdutos)
  private readonly lancamentoRepository: Repository<LancamentosProdutos>;

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

    const lancamento = this.lancamentoRepository.create({
      ...createLancamentosProdutoDto,
    });
    return this.lancamentoRepository.save(lancamento);
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
      const loteAtual = await this.lancamentoRepository.findOne({
        where: {
          lote: updateLancamentosProdutoDto.lote,
        },
      });

      if (loteAtual.id != id) {
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

    const lancamentoProduto = await this.lancamentoRepository.preload({
      ...updateLancamentosProdutoDto,
      id,
    });

    if (!lancamentoProduto) {
      throw new NotFoundException(
        `Nenhum lançamento encontrado para o id ${id}`,
      );
    }

    return this.lancamentoRepository.save(lancamentoProduto);
  }

  async findAll() {
    return await this.lancamentoRepository.find({
      relations: [
        'produto',
        'fornecedor',
        'localizacaoDeposito',
        'localizacaoDeposito.deposito',
        'usuario',
      ],
    });
  }

  async findOne(id: number) {
    return await this.lancamentoRepository.findOne({
      where: { id },
      relations: [
        'produto',
        'fornecedor',
        'localizacaoDeposito',
        'localizacaoDeposito.deposito',
      ],
    });
  }

  async remove(id: number, queryRunner?: QueryRunner) {
    try {
      let lancamentoProduto: LancamentosProdutos;

      if (queryRunner) {
        lancamentoProduto = await queryRunner.manager.findOne(
          LancamentosProdutos,
          {
            where: { id },
          },
        );
      } else {
        lancamentoProduto = await this.findOne(id);
      }

      if (!lancamentoProduto) {
        throw new NotFoundException(
          `Nenhum lançamento de produto encontrado para o id ${id}`,
        );
      }

      if (queryRunner) {
        await queryRunner.manager.remove(
          LancamentosProdutos,
          lancamentoProduto,
        );
      } else {
        await this.lancamentoRepository.remove(lancamentoProduto);
      }
    } catch (error) {
      throw new ConflictException(
        'Não foi possível excluir o lançamento do produto porque há movimentações associadas a ele.',
      );
    }
  }

  async buscarPorLote(lote: string) {
    return await this.lancamentoRepository.find({
      where: { lote },
    });
  }

  async loteJaCadastrado(lote: string, ehAtualizacao = false) {
    const jaExiste = await this.lancamentoRepository.count({
      where: { lote: lote },
    });

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
    return service.create({ ...entidade });
  }
}
