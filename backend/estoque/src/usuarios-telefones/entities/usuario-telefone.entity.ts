import { Usuarios } from 'src/usuarios/entities/usuario.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('pk_usuarios_telefones_id', ['id'], { unique: true })
@Index('un_usuarios_telefones_id_usuario', ['usuario'], { unique: true })
@Entity('usuarios_telefones', { schema: 'public' })
export class UsuariosTelefones {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'telefone_principal', length: 20 })
  telefonePrincipal: string;

  @Column('character varying', { name: 'telefone', nullable: true, length: 20 })
  telefone: string | null;

  @OneToOne(() => Usuarios, (usuarios) => usuarios.usuariosTelefones)
  @JoinColumn([{ name: 'id_usuario', referencedColumnName: 'id' }])
  usuario: Usuarios;
}
