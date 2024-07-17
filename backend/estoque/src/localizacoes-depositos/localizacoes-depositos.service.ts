import { ConflictException, Injectable } from '@nestjs/common';
import { CreateLocalizacoesDepositoDto } from './dto/create-localizacoes-deposito.dto';
import { UpdateLocalizacoesDepositoDto } from './dto/update-localizacoes-deposito.dto';
import { DepositosService } from 'src/depositos/depositos.service';
import { LocalizacoesDepositosRepository } from './localizacoes-depositos.repository';

@Injectable()
export class LocalizacoesDepositosService {
  constructor(
    private readonly repositorio: LocalizacoesDepositosRepository,
    private readonly depositoService: DepositosService,
  ) {}

  async create(createLocalizacoesDepositoDto: CreateLocalizacoesDepositoDto) {
    createLocalizacoesDepositoDto.deposito =
      await this.obtemEntidadeEstrangeira(
        createLocalizacoesDepositoDto.deposito,
        this.depositoService,
      );
    return await this.repositorio.createLocalizacaoDeposito(
      createLocalizacoesDepositoDto,
    );
  }

  async findAll() {
    return await this.repositorio.obterTodos();
  }

  async findOne(id: number) {
    return await this.repositorio.obterPorId(id);
  }

  async update(
    id: number,
    updateLocalizacoesDepositoDto: UpdateLocalizacoesDepositoDto,
  ) {
    updateLocalizacoesDepositoDto.deposito =
      await this.obtemEntidadeEstrangeira(
        updateLocalizacoesDepositoDto.deposito,
        this.depositoService,
      );

    return await this.repositorio.updateLocalizacaoDeposito(
      id,
      updateLocalizacoesDepositoDto,
    );
  }

  async remove(id: number) {
    try {
      return await this.repositorio.excluir(id);
    } catch (error) {
      throw new ConflictException(
        'Não foi possível excluir a localização do depósito',
      );
    }
  }

  private async obtemEntidadeEstrangeira(entidade: any, service: any) {
    if (entidade.id) {
      const entidadeBD = await service.findOne(entidade.id);
      return await service.update(entidadeBD.id, entidade);
    }
    return service.create({ ...entidade });
  }
}
