import { Injectable, NotFoundException } from '@nestjs/common';
import { LocalizacoesDepositos } from './entities/localizacao-deposito.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateLocalizacoesDepositoDto } from './dto/create-localizacoes-deposito.dto';
import { UpdateLocalizacoesDepositoDto } from './dto/update-localizacoes-deposito.dto';

@Injectable()
export class LocalizacoesDepositosRepository extends Repository<LocalizacoesDepositos> {
  constructor(private dataSource: DataSource) {
    super(LocalizacoesDepositos, dataSource.createEntityManager());
  }

  async createLocalizacaoDeposito(
    createLocalizacoesDepositoDto: CreateLocalizacoesDepositoDto,
  ): Promise<LocalizacoesDepositos> {
    const localizacao = this.create({
      ...createLocalizacoesDepositoDto,
    });
    return await this.save(localizacao);
  }

  async updateLocalizacaoDeposito(
    id: number,
    updateLocalizacoesDepositoDto: UpdateLocalizacoesDepositoDto,
  ): Promise<LocalizacoesDepositos> {
    const localizacaoDeposito = await this.preload({
      ...updateLocalizacoesDepositoDto,
      id,
    });

    if (!localizacaoDeposito) {
      throw new NotFoundException(
        `Nenhuma localização de deposito econtrada para o id ${id}`,
      );
    }

    return await this.save(localizacaoDeposito);
  }

  async obterTodos(): Promise<LocalizacoesDepositos[]> {
    return await this.find({
      relations: ['deposito'],
    });
  }

  async obterPorId(id: number): Promise<LocalizacoesDepositos> {
    return await this.findOne({
      where: { id },
      relations: ['deposito'],
    });
  }

  async excluir(id: number) {
    const localizacaoDeposito = await this.obterPorId(id);

    return await this.remove(localizacaoDeposito);
  }
}
