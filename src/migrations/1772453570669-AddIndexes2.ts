import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexes21772453570669 implements MigrationInterface {
    name = 'AddIndexes21772453570669'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."idx_order_items_productId"`);
        await queryRunner.query(`DROP INDEX "public"."idx_order_items_orderId"`);
        await queryRunner.query(`DROP INDEX "public"."idx_orders_status_createdAt"`);
        await queryRunner.query(`ALTER TYPE "public"."orders_status_enum" RENAME TO "orders_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('CREATED', 'PAID', 'CANCELLED')`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" TYPE "public"."orders_status_enum" USING "status"::"text"::"public"."orders_status_enum"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'CREATED'`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum_old"`);
        await queryRunner.query(`CREATE INDEX "IDX_order_items_product_id" ON "order_items" ("product_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_order_items_order_id" ON "order_items" ("order_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_orders_created_at" ON "orders" ("created_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_orders_user_id" ON "orders" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_orders_status" ON "orders" ("status") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_orders_status"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_orders_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_orders_created_at"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_order_items_order_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_order_items_product_id"`);
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum_old" AS ENUM('CREATED', 'PAID', 'CANCELLED')`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" TYPE "public"."orders_status_enum_old" USING "status"::"text"::"public"."orders_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'CREATED'`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."orders_status_enum_old" RENAME TO "orders_status_enum"`);
        await queryRunner.query(`CREATE INDEX "idx_orders_status_createdAt" ON "orders" ("created_at", "status") `);
        await queryRunner.query(`CREATE INDEX "idx_order_items_orderId" ON "order_items" ("order_id") `);
        await queryRunner.query(`CREATE INDEX "idx_order_items_productId" ON "order_items" ("product_id") `);
    }

}
