import { MigrationInterface, QueryRunner } from "typeorm";

export class Renametables1772193943758 implements MigrationInterface {
    name = 'Renametables1772193943758'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "age" integer NOT NULL, "name" character varying(100) NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "currencies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying(3) NOT NULL, "name" character varying NOT NULL, "symbol" character varying(5) NOT NULL, "precision" integer NOT NULL, "isDefault" boolean NOT NULL, CONSTRAINT "UQ_9f8d0972aeeb5a2277e40332d29" UNIQUE ("code"), CONSTRAINT "PK_d528c54860c4182db13548e08c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."product_prices_type_enum" AS ENUM('SALE', 'SUPPLY', 'OFFER')`);
        await queryRunner.query(`CREATE TABLE "product_prices" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."product_prices_type_enum" NOT NULL, "amount" bigint NOT NULL, "validFrom" TIMESTAMP WITH TIME ZONE NOT NULL, "validTo" TIMESTAMP WITH TIME ZONE, "isActive" boolean NOT NULL DEFAULT true, "productId" uuid, "currencyId" uuid, CONSTRAINT "PK_31c33ddacf759f7c0e5d327c4bb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ced52524408aa726d61f72160d" ON "product_prices" ("productId", "type", "validFrom", "validTo") `);
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(200) NOT NULL, "displayedName" character varying, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product_prices" ADD CONSTRAINT "FK_08b505f0f33710eb52a6f34ada4" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_prices" ADD CONSTRAINT "FK_1a6d747dc8baf1ffac864b177ca" FOREIGN KEY ("currencyId") REFERENCES "currencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_prices" DROP CONSTRAINT "FK_1a6d747dc8baf1ffac864b177ca"`);
        await queryRunner.query(`ALTER TABLE "product_prices" DROP CONSTRAINT "FK_08b505f0f33710eb52a6f34ada4"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ced52524408aa726d61f72160d"`);
        await queryRunner.query(`DROP TABLE "product_prices"`);
        await queryRunner.query(`DROP TYPE "public"."product_prices_type_enum"`);
        await queryRunner.query(`DROP TABLE "currencies"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
