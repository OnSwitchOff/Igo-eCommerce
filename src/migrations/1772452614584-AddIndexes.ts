import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexes1772452614584 implements MigrationInterface {
  name = 'AddIndexes1772452614584';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."orders_status_enum" RENAME TO "orders_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_status_enum" AS ENUM('CREATED', 'PAID', 'CANCELLED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "status" TYPE "public"."orders_status_enum" USING "status"::"text"::"public"."orders_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'CREATED'`,
    );
    await queryRunner.query(`DROP TYPE "public"."orders_status_enum_old"`);
    await queryRunner.query(
      `CREATE INDEX "idx_order_items_productId" ON "order_items" ("product_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_order_items_orderId" ON "order_items" ("order_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_orders_status_createdAt" ON "orders" ("status", "created_at") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."idx_orders_status_createdAt"`,
    );
    await queryRunner.query(`DROP INDEX "public"."idx_order_items_orderId"`);
    await queryRunner.query(`DROP INDEX "public"."idx_order_items_productId"`);
    await queryRunner.query(
      `CREATE TYPE "public"."orders_status_enum_old" AS ENUM('CREATED', 'PAID', 'CANCELLED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "status" TYPE "public"."orders_status_enum_old" USING "status"::"text"::"public"."orders_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'CREATED'`,
    );
    await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."orders_status_enum_old" RENAME TO "orders_status_enum"`,
    );
  }
}
