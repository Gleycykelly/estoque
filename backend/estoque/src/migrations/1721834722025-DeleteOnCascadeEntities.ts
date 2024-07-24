import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteOnCascadeEntities1721834722025
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`

            ALTER TABLE "porcoes" DROP CONSTRAINT "fk_porcoes_id_valor_nutricional";
            ALTER TABLE "porcoes" ADD CONSTRAINT "fk_porcoes_id_valor_nutricional" FOREIGN KEY ("id_valor_nutricional") REFERENCES "valores_nutricionais"("id") ON DELETE CASCADE;
      
            ALTER TABLE "porcoes" DROP CONSTRAINT "fk_porcoes_id_informacao_adicional";
            ALTER TABLE "porcoes" ADD CONSTRAINT "fk_porcoes_id_informacao_adicional" FOREIGN KEY ("id_informacao_nutricional") REFERENCES "informacoes_nutricionais"("id") ON DELETE CASCADE;
      
            ALTER TABLE "movimentacoes" DROP CONSTRAINT "fk_movimentacoes_id_lancamento_produto";
            ALTER TABLE "movimentacoes" ADD CONSTRAINT "fk_movimentacoes_id_lancamento_produto" FOREIGN KEY ("id_lancamento_produto") REFERENCES "lancamentos_produtos"("id") ON DELETE CASCADE;

            ALTER TABLE "lancamentos_produtos" DROP CONSTRAINT "fk_lancamentos_produtos_id_localizacao_deposito";
            ALTER TABLE "lancamentos_produtos" ADD CONSTRAINT "fk_lancamentos_produtos_id_localizacao_deposito" FOREIGN KEY ("id_localizacao_deposito") REFERENCES "localizacoes_depositos"("id") ON DELETE CASCADE;

            ALTER TABLE "usuarios_depositos" DROP CONSTRAINT "fk_usuarios_depositos_id_deposito";
            ALTER TABLE "usuarios_depositos" ADD CONSTRAINT "fk_usuarios_depositos_id_deposito" FOREIGN KEY ("id_deposito") REFERENCES "depositos"("id") ON DELETE CASCADE;
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
               ALTER TABLE "porcoes" DROP CONSTRAINT "fk_porcoes_id_valor_nutricional";
            ALTER TABLE "porcoes" ADD CONSTRAINT "fk_porcoes_id_valor_nutricional" FOREIGN KEY ("id_valor_nutricional") REFERENCES "valores_nutricionais"("id");
      
            ALTER TABLE "porcoes" DROP CONSTRAINT "fk_porcoes_id_informacao_adicional";
            ALTER TABLE "porcoes" ADD CONSTRAINT "fk_porcoes_id_informacao_adicional" FOREIGN KEY ("id_informacao_nutricional") REFERENCES "informacoes_nutricionais"("id");
      
            ALTER TABLE "movimentacoes" DROP CONSTRAINT "fk_movimentacoes_id_lancamento_produto";
            ALTER TABLE "movimentacoes" ADD CONSTRAINT "fk_movimentacoes_id_lancamento_produto" FOREIGN KEY ("id_lancamento_produto") REFERENCES "lancamentos_produtos"("id");

            ALTER TABLE "lancamentos_produtos" DROP CONSTRAINT "fk_lancamentos_produtos_id_localizacao_deposito";
            ALTER TABLE "lancamentos_produtos" ADD CONSTRAINT "fk_lancamentos_produtos_id_localizacao_deposito" FOREIGN KEY ("id_localizacao_deposito") REFERENCES "localizacoes_depositos"("id");

            ALTER TABLE "usuarios_depositos" DROP CONSTRAINT "fk_usuarios_depositos_id_deposito ";
            ALTER TABLE "usuarios_depositos" ADD CONSTRAINT "fk_usuarios_depositos_id_deposito " FOREIGN KEY ("id_deposito") REFERENCES "depositos"("id");
          `);
  }
}
