import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameColumns1772194948863 implements MigrationInterface {
    name = 'RenameColumns1772194948863'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_prices" DROP CONSTRAINT "FK_08b505f0f33710eb52a6f34ada4"`);
        await queryRunner.query(`ALTER TABLE "product_prices" DROP CONSTRAINT "FK_1a6d747dc8baf1ffac864b177ca"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ced52524408aa726d61f72160d"`);
        await queryRunner.query(`ALTER TABLE "product_prices" DROP COLUMN "productId"`);
        await queryRunner.query(`ALTER TABLE "product_prices" DROP COLUMN "currencyId"`);
        await queryRunner.query(`ALTER TABLE "product_prices" ADD "product_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_prices" ADD "currency_id" uuid NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_b4481c4ce70734eb65af24fdea" ON "product_prices" ("product_id", "type", "validFrom", "validTo") `);
        await queryRunner.query(`ALTER TABLE "product_prices" ADD CONSTRAINT "FK_8218c69c7f5a3706662101fa788" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_prices" ADD CONSTRAINT "FK_c8b32dd64acb24047e524b7c90c" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_prices" DROP CONSTRAINT "FK_c8b32dd64acb24047e524b7c90c"`);
        await queryRunner.query(`ALTER TABLE "product_prices" DROP CONSTRAINT "FK_8218c69c7f5a3706662101fa788"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b4481c4ce70734eb65af24fdea"`);
        await queryRunner.query(`ALTER TABLE "product_prices" DROP COLUMN "currency_id"`);
        await queryRunner.query(`ALTER TABLE "product_prices" DROP COLUMN "product_id"`);
        await queryRunner.query(`ALTER TABLE "product_prices" ADD "currencyId" uuid`);
        await queryRunner.query(`ALTER TABLE "product_prices" ADD "productId" uuid`);
        await queryRunner.query(`CREATE INDEX "IDX_ced52524408aa726d61f72160d" ON "product_prices" ("productId", "type", "validFrom", "validTo") `);
        await queryRunner.query(`ALTER TABLE "product_prices" ADD CONSTRAINT "FK_1a6d747dc8baf1ffac864b177ca" FOREIGN KEY ("currencyId") REFERENCES "currencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_prices" ADD CONSTRAINT "FK_08b505f0f33710eb52a6f34ada4" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
