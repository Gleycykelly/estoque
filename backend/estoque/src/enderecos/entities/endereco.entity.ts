import { Depositos } from 'src/depositos/entities/deposito.entity';
import { Fornecedores } from 'src/fornecedores/entities/fornecedor.entity';
import { Municipios } from 'src/municipios/entities/municipio.entity';
import { Usuarios } from 'src/usuarios/entities/usuario.entity';
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

@Index('pk_enderecos_id', ['id'], { unique: true })
@Entity('enderecos', { schema: 'public' })
export class Enderecos {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'logradouro', length: 100 })
  logradouro: string;

  @Column('integer', { name: 'numero', nullable: true })
  numero: number | null;

  @Column('integer', { name: 'lote', nullable: true })
  lote: number | null;

  @Column('character varying', { name: 'bairro', length: 100 })
  bairro: string;

  @Column('character varying', { name: 'cep', length: 10 })
  cep: string;

  @Column('character varying', {
    name: 'complemento',
    nullable: true,
    length: 250,
  })
  complemento: string | null;

  @OneToMany(() => Depositos, (depositos) => depositos.endereco)
  depositos: Depositos[];

  @ManyToOne(() => Municipios, (municipios) => municipios.enderecos)
  @JoinColumn([{ name: 'id_municipio', referencedColumnName: 'id' }])
  municipio: Municipios;

  @OneToMany(() => Fornecedores, (fornecedores) => fornecedores.endereco)
  fornecedores: Fornecedores[];

  @ManyToMany(() => Usuarios, (usuarios) => usuarios.enderecos)
  @JoinTable({
    name: 'usuarios_enderecos',
    joinColumns: [{ name: 'id_endereco', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'id_usuario', referencedColumnName: 'id' }],
    schema: 'public',
  })
  usuarios: Usuarios[];
}
