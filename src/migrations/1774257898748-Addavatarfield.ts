import { MigrationInterface, QueryRunner } from "typeorm";

export class Addavatarfield1774257898748 implements MigrationInterface {
    name = 'Addavatarfield1774257898748'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" ADD "visibility" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "files" ADD "entity_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "avatar_file_id" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_65eb1fa7df7811daaec973798ce" UNIQUE ("avatar_file_id")`);
        await queryRunner.query(`ALTER TYPE "public"."orders_status_enum" RENAME TO "orders_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('CREATED', 'PAID', 'CANCELLED')`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" TYPE "public"."orders_status_enum" USING "status"::"text"::"public"."orders_status_enum"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'CREATED'`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "roles" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "scopes" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_65eb1fa7df7811daaec973798ce" FOREIGN KEY ("avatar_file_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_65eb1fa7df7811daaec973798ce"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "scopes" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "roles" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum_old" AS ENUM('CREATED', 'PAID', 'CANCELLED')`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" TYPE "public"."orders_status_enum_old" USING "status"::"text"::"public"."orders_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'CREATED'`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."orders_status_enum_old" RENAME TO "orders_status_enum"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_65eb1fa7df7811daaec973798ce"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar_file_id"`);
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "entity_id"`);
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "visibility"`);
    }

}
