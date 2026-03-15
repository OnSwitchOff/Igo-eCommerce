import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameColumns21772195239587 implements MigrationInterface {
  name = 'RenameColumns21772195239587';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b4481c4ce70734eb65af24fdea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "createdAt" TO "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "currencies" RENAME COLUMN "isDefault" TO "is_default"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" RENAME COLUMN "displayedName" TO "displayed_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_prices" DROP COLUMN "validFrom"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_prices" DROP COLUMN "validTo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_prices" DROP COLUMN "isActive"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_prices" ADD "valid_from" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_prices" ADD "valid_to" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_prices" ADD "is_active" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_at"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2c2d50bb6d777791191f30a087" ON "product_prices" ("product_id", "type", "valid_from", "valid_to") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2c2d50bb6d777791191f30a087"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_at"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_prices" DROP COLUMN "is_active"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_prices" DROP COLUMN "valid_to"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_prices" DROP COLUMN "valid_from"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_prices" ADD "isActive" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_prices" ADD "validTo" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_prices" ADD "validFrom" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" RENAME COLUMN "displayed_name" TO "displayedName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "currencies" RENAME COLUMN "is_default" TO "isDefault"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "created_at" TO "createdAt"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b4481c4ce70734eb65af24fdea" ON "product_prices" ("product_id", "type", "validFrom", "validTo") `,
    );
  }
}
