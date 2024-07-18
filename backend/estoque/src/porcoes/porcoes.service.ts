import {
  ConflictException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { CreatePorcoeDto } from './dto/create-porcoe.dto';
import { UpdatePorcoeDto } from './dto/update-porcoe.dto';
import { ProdutosService } from 'src/produtos/produtos.service';
import { UnidadesMedidasService } from 'src/unidades_medidas/unidades_medidas.service';
import { ValoresNutricionaisService } from 'src/valores-nutricionais/valores-nutricionais.service';
import { InformacoesNutricionaisService } from 'src/informacoes-nutricionais/informacoes-nutricionais.service';
import { PorcoesRepository } from './porcoes.repository';

@Injectable()
export class PorcoesService {
  constructor(
    @Inject(forwardRef(() => ProdutosService))
    private repositorio: PorcoesRepository,
    private readonly produtoService: ProdutosService,
    private readonly unidadeMedidaService: UnidadesMedidasService,
    private readonly valorNutricionalService: ValoresNutricionaisService,
    private readonly informacaoNutricionalService: InformacoesNutricionaisService,
  ) {}

  async create(createPorcoeDto: CreatePorcoeDto) {
    await this.porcaoJaCadastrada(
      createPorcoeDto.porcao,
      createPorcoeDto.produto,
    );

    createPorcoeDto.informacaoNutricional = await this.obtemEntidadeEstrangeira(
      createPorcoeDto.informacaoNutricional,
      this.informacaoNutricionalService,
    );

    createPorcoeDto.valorNutricional = await this.obtemEntidadeEstrangeira(
      createPorcoeDto.valorNutricional,
      this.valorNutricionalService,
    );

    createPorcoeDto.unidadeMedida = await this.obtemEntidadeEstrangeira(
      createPorcoeDto.unidadeMedida,
      this.unidadeMedidaService,
    );

    return await this.repositorio.createPorcao(createPorcoeDto);
  }

  async update(id: number, updatePorcoeDto: UpdatePorcoeDto) {
    updatePorcoeDto.informacaoNutricional = await this.obtemEntidadeEstrangeira(
      updatePorcoeDto.informacaoNutricional,
      this.informacaoNutricionalService,
    );

    updatePorcoeDto.valorNutricional = await this.obtemEntidadeEstrangeira(
      updatePorcoeDto.valorNutricional,
      this.valorNutricionalService,
    );

    updatePorcoeDto.unidadeMedida = await this.obtemEntidadeEstrangeira(
      updatePorcoeDto.unidadeMedida,
      this.unidadeMedidaService,
    );

    const JaCadastrado = await this.porcaoJaCadastrada(
      updatePorcoeDto.porcao,
      updatePorcoeDto.produto,
      true,
    );

    if (JaCadastrado) {
      const porcaoAtual = await this.repositorio.porcaoPorProduto(
        updatePorcoeDto.porcao,
        updatePorcoeDto.produto.id,
      );
      if (porcaoAtual.id != id) {
        throw new ConflictException(
          `Porção ${updatePorcoeDto.porcao} já cadastrada!`,
        );
      }
    }

    return await this.repositorio.updatePorcao(id, updatePorcoeDto);
  }

  async findAll() {
    return await this.repositorio.obterTodos();
  }

  async findOne(id: number) {
    return await this.repositorio.obterPorId(id);
  }

  async remove(id: number) {
    try {
      return await this.repositorio.excluir(id);
    } catch (error) {
      throw new ConflictException('Não foi possível excluir a porção.');
    }
  }

  async porcaoJaCadastrada(
    porcao: string,
    produto: any,
    ehAtualizacao = false,
  ) {
    const jaExiste = await this.repositorio.existePorcao(porcao, produto.id);

    if (jaExiste && !ehAtualizacao) {
      throw new ConflictException(`Porção ${porcao} já cadastrada !`);
    } else if (jaExiste) {
      return true;
    }

    return false;
  }

  private async obtemEntidadeEstrangeira(entidade: any, service: any) {
    if (entidade.id) {
      const entidadeBD = await service.findOne(entidade.id);
      await service.update(entidadeBD.id, entidade);
      return entidadeBD;
    }

    return service.create({ ...entidade });
  }
}
