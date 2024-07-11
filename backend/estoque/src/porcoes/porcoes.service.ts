import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreatePorcoeDto } from './dto/create-porcoe.dto';
import { UpdatePorcoeDto } from './dto/update-porcoe.dto';
import { Porcoes } from './entities/porcao.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProdutosService } from 'src/produtos/produtos.service';
import { UnidadesMedidasService } from 'src/unidades_medidas/unidades_medidas.service';
import { ValoresNutricionaisService } from 'src/valores-nutricionais/valores-nutricionais.service';
import { InformacoesNutricionaisService } from 'src/informacoes-nutricionais/informacoes-nutricionais.service';

@Injectable()
export class PorcoesService {
  constructor(
    @Inject(forwardRef(() => ProdutosService))
    private readonly produtoService: ProdutosService,
    private readonly unidadeMedidaService: UnidadesMedidasService,
    private readonly valorNutricionalService: ValoresNutricionaisService,
    private readonly informacaoNutricionalService: InformacoesNutricionaisService,
  ) {}
  @InjectRepository(Porcoes)
  private readonly porcoesRepository: Repository<Porcoes>;

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

    const porcao = this.porcoesRepository.create({
      ...createPorcoeDto,
    });

    return this.porcoesRepository.save(porcao);
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
      const porcaoAtual = await this.porcoesRepository.findOne({
        where: {
          porcao: updatePorcoeDto.porcao,
          produto: { id: updatePorcoeDto.produto.id },
        },
      });
      if (porcaoAtual.id != id) {
        throw new ConflictException(
          `Porção ${updatePorcoeDto.porcao} já cadastrada!`,
        );
      }
    }

    const porcao = await this.porcoesRepository.preload({
      ...updatePorcoeDto,
      id,
    });

    if (!porcao) {
      throw new NotFoundException(`Nenhuma porção encontrada para o id ${id}`);
    }

    return this.porcoesRepository.save(porcao);
  }

  async findAll() {
    return await this.porcoesRepository.find({
      relations: [
        'produto',
        'unidadeMedida',
        'valorNutricional',
        'informacaoNutricional',
      ],
      order: {
        id: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    return await this.porcoesRepository.findOne({
      where: { id },
      relations: [
        'produto',
        'unidadeMedida',
        'valorNutricional',
        'informacaoNutricional',
      ],
    });
  }

  async remove(id: number) {
    const porcao = await this.findOne(id);

    if (!porcao) {
      throw new NotFoundException(`Nenhuma porção encontrada para o id ${id}`);
    }

    return this.porcoesRepository.remove(porcao);
  }

  async porcaoJaCadastrada(
    porcao: string,
    produto: any,
    ehAtualizacao = false,
  ) {
    const jaExiste = await this.porcoesRepository.count({
      where: { porcao: porcao, produto: { id: produto.id } },
    });

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
