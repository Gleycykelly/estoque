import {
  ConflictException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { CreateDepositoDto } from './dto/create-deposito.dto';
import { UpdateDepositoDto } from './dto/update-deposito.dto';
import { Depositos } from './entities/deposito.entity';
import { ObterParcialDepositoDto } from './dto/obter-parcial-deposito.dto';
import { EnderecosService } from 'src/enderecos/enderecos.service';
import { DepositosRepository } from './depositos.repository';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Injectable()
export class DepositosService {
  constructor(
    private repositorio: DepositosRepository,
    @Inject(forwardRef(() => UsuariosService))
    private readonly usuarioService: UsuariosService,
    private readonly enderecoService: EnderecosService,
  ) {}

  async create(createDepositoDto: CreateDepositoDto) {
    await this.depositoJaCadastrado(createDepositoDto.descricao);

    createDepositoDto.endereco = await this.obtemEntidadeEstrangeira(
      createDepositoDto.endereco,
      this.enderecoService,
    );

    this.repositorio.createDeposito(createDepositoDto);
  }

  async update(id: number, updateDepositoDto: UpdateDepositoDto) {
    const JaCadastrado = await this.depositoJaCadastrado(
      updateDepositoDto.descricao,
      true,
    );

    if (JaCadastrado) {
      const depositoAtual = await this.repositorio.obterPelaDescricao(
        updateDepositoDto.descricao,
      );

      if (depositoAtual && depositoAtual.id != id) {
        throw new ConflictException(
          `O depósito ${updateDepositoDto.descricao} já está cadastrado!`,
        );
      }
    }

    updateDepositoDto.endereco = await this.obtemEntidadeEstrangeira(
      updateDepositoDto.endereco,
      this.enderecoService,
    );

    return await this.repositorio.updateDeposito(id, updateDepositoDto);
  }

  async findAll() {
    return await this.repositorio.obterTodos();
  }

  async findOne(id: number) {
    return await this.repositorio.obterPorId(id);
  }

  async obterParcial(
    obterParcialDepositoDto: ObterParcialDepositoDto,
    token: string,
  ): Promise<Depositos[]> {
    const dadosUsuarioLogado =
      await this.usuarioService.obterUsuarioLogado(token);

    const depositos = [];

    if (dadosUsuarioLogado.permissaoUsuario != 'Administrador') {
      for (const deposito of dadosUsuarioLogado.depositos) {
        depositos.push(deposito.id);
      }
    }

    if (
      dadosUsuarioLogado.permissaoUsuario === 'Usuario' &&
      depositos.length < 1
    ) {
      return null;
    }

    return await this.repositorio.obterParcial(obterParcialDepositoDto);
  }

  async remove(id: number) {
    try {
      return await this.repositorio.excluir(id);
    } catch (error) {
      throw new ConflictException('Não foi possível excluir o depósito.');
    }
  }

  async depositoJaCadastrado(descricao: string, ehAtualizacao = false) {
    const jaExiste = await this.repositorio.existeDeposito(descricao);

    if (jaExiste && !ehAtualizacao) {
      throw new ConflictException(
        `O depósito ${descricao} já está cadastrado!`,
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

    return await service.create({ ...entidade });
  }

  async obterQuantidadeDeDepositosVisiveis(token: string) {
    const dadosUsuarioLogado =
      await this.usuarioService.obterUsuarioLogado(token);

    const depositos = [];

    if (dadosUsuarioLogado.permissaoUsuario != 'Administrador') {
      for (const deposito of dadosUsuarioLogado.depositos) {
        depositos.push(deposito.id);
      }
    }

    if (
      dadosUsuarioLogado.permissaoUsuario === 'Usuario' &&
      depositos.length < 1
    ) {
      return {
        quantidadeDepositos: 0,
      };
    }

    const results =
      await this.repositorio.obterQuantidadeDeDepositosVisiveis(depositos);
    const { quantidade_depositos } = results[0];
    return {
      quantidadeDepositos: quantidade_depositos || 0,
    };
  }
}
