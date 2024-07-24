import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterRelationsToCascade1721822287766
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "usuarios_telefones" DROP CONSTRAINT "fk_usuarios_telefones_id_usuario";
            ALTER TABLE "usuarios_telefones" ADD CONSTRAINT "fk_usuarios_telefones_id_usuario" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE CASCADE;
      
            ALTER TABLE "usuarios_enderecos" DROP CONSTRAINT "fk_usuario_endereco_id_usuario";
            ALTER TABLE "usuarios_enderecos" ADD CONSTRAINT "fk_usuario_endereco_id_usuario" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE CASCADE;
      
            ALTER TABLE "usuarios_depositos" DROP CONSTRAINT "fk_usuarios_depositos_id_responsavel";
            ALTER TABLE "usuarios_depositos" ADD CONSTRAINT "fk_usuarios_depositos_id_responsavel" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE CASCADE;
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "usuarios_telefones" DROP CONSTRAINT "fk_usuarios_telefones_id_usuario";
            ALTER TABLE "usuarios_telefones" ADD CONSTRAINT "fk_usuarios_telefones_id_usuario" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id");
      
            ALTER TABLE "usuarios_enderecos" DROP CONSTRAINT "fk_usuario_endereco_id_usuario";
            ALTER TABLE "usuarios_enderecos" ADD CONSTRAINT "fk_usuario_endereco_id_usuario" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id");
      
            ALTER TABLE "usuarios_depositos" DROP CONSTRAINT "fk_usuarios_depositos_id_responsavel";
            ALTER TABLE "usuarios_depositos" ADD CONSTRAINT "fk_usuarios_depositos_id_responsavel" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id");
          `);
  }
}
