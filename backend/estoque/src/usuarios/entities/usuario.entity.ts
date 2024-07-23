import { Depositos } from 'src/depositos/entities/deposito.entity';
import { Enderecos } from 'src/enderecos/entities/endereco.entity';
import { Movimentacoes } from 'src/movimentacoes/entities/movimentacao.entity';
import { Produtos } from 'src/produtos/entities/produto.entity';
import { UsuariosTelefones } from 'src/usuarios-telefones/entities/usuario-telefone.entity';
import {
  Column,
  Entity,
  Index,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('un_usuarios_cpf', ['cpf'], { unique: true })
@Index('un_usuarios_email', ['email'], { unique: true })
@Index('pk_usuarios_id', ['id'], { unique: true })
@Index('un_usuarios_rg', ['rg'], { unique: true })
@Entity('usuarios', { schema: 'public' })
export class Usuarios {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'email', unique: true, length: 100 })
  email: string;

  @Column('character varying', { name: 'senha', length: 180 })
  senha: string;

  @Column('character varying', { name: 'nome', length: 150 })
  nome: string;

  @Column('character varying', { name: 'cpf', unique: true, length: 14 })
  cpf: string;

  @Column('character varying', { name: 'rg', unique: true, length: 12 })
  rg: string;

  @Column('date', { name: 'data_nascimento' })
  dataNascimento: string;

  @Column('enum', {
    name: 'genero_usuario',
    nullable: true,
    enum: ['Feminino', 'Masculino'],
  })
  generoUsuario: 'Feminino' | 'Masculino' | null;

  @Column('enum', {
    name: 'permissao',
    nullable: true,
    enum: ['Usuario', 'Administrador'],
  })
  permissaoUsuario: 'Usuario' | 'Administrador' | null;

  @OneToMany(() => Movimentacoes, (movimentacoes) => movimentacoes.usuario)
  movimentacoes: Movimentacoes[];

  @OneToMany(() => Produtos, (produtos) => produtos.usuario)
  produtos: Produtos[];

  @ManyToMany(() => Depositos, (depositos) => depositos.usuarios, {
    cascade: true,
  })
  depositos: Depositos[];

  @ManyToMany(() => Enderecos, (enderecos) => enderecos.usuarios, {
    cascade: true,
  })
  enderecos: Enderecos[];

  @OneToOne(
    () => UsuariosTelefones,
    (usuariosTelefones) => usuariosTelefones.usuario,
    { cascade: true },
  )
  usuariosTelefones: UsuariosTelefones;
}
