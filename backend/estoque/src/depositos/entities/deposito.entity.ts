import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Enderecos } from 'src/enderecos/entities/endereco.entity';
import { Usuarios } from 'src/usuarios/entities/usuario.entity';
import { LocalizacoesDepositos } from 'src/localizacoes-depositos/entities/localizacao-deposito.entity';

@Index('un_depositos_descricao', ['descricao'], { unique: true })
@Index('pk_depositos_id', ['id'], { unique: true })
@Entity('depositos', { schema: 'public' })
export class Depositos {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'descricao', unique: true, length: 100 })
  descricao: string;

  @ManyToOne(() => Enderecos, (enderecos) => enderecos.depositos)
  @JoinColumn([{ name: 'id_endereco', referencedColumnName: 'id' }])
  endereco: Enderecos;

  @OneToMany(
    () => LocalizacoesDepositos,
    (localizacoesDepositos) => localizacoesDepositos.deposito,
  )
  localizacoesDepositos: LocalizacoesDepositos[];

  @ManyToMany(() => Usuarios, (usuarios) => usuarios.depositos)
  @JoinTable({
    name: 'usuarios_depositos',
    joinColumns: [{ name: 'id_deposito', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'id_usuario', referencedColumnName: 'id' }],
    schema: 'public',
  })
  usuarios: Usuarios[];
}
