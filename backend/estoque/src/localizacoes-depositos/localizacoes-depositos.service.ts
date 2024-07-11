import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLocalizacoesDepositoDto } from './dto/create-localizacoes-deposito.dto';
import { UpdateLocalizacoesDepositoDto } from './dto/update-localizacoes-deposito.dto';
import { LocalizacoesDepositos } from './entities/localizacao-deposito.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DepositosService } from 'src/depositos/depositos.service';

@Injectable()
export class LocalizacoesDepositosService {
  constructor(private readonly depositoService: DepositosService) {}
  @InjectRepository(LocalizacoesDepositos)
  private readonly localizacoesDepositosRepository: Repository<LocalizacoesDepositos>;

  async create(createLocalizacoesDepositoDto: CreateLocalizacoesDepositoDto) {
    createLocalizacoesDepositoDto.deposito =
      await this.obtemEntidadeEstrangeira(
        createLocalizacoesDepositoDto.deposito,
        this.depositoService,
      );

    const localizacao = this.localizacoesDepositosRepository.create({
      ...createLocalizacoesDepositoDto,
    });
    return this.localizacoesDepositosRepository.save(localizacao);
  }

  async findAll() {
    return await this.localizacoesDepositosRepository.find({
      relations: ['deposito'],
    });
  }

  async findOne(id: number) {
    return await this.localizacoesDepositosRepository.findOne({
      where: { id },
      relations: ['deposito'],
    });
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

    const localizacaoDeposito =
      await this.localizacoesDepositosRepository.preload({
        ...updateLocalizacoesDepositoDto,
        id,
      });

    if (!localizacaoDeposito) {
      throw new NotFoundException(
        `Nenhuma localização de deposito econtrada para o id ${id}`,
      );
    }

    return this.localizacoesDepositosRepository.save(localizacaoDeposito);
  }

  async remove(id: number) {
    try {
      const localizacaoDeposito = await this.findOne(id);

      return await this.localizacoesDepositosRepository.remove(
        localizacaoDeposito,
      );
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
