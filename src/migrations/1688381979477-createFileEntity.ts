import {MigrationInterface, QueryRunner} from "typeorm";

export class createFileEntity1688381979477 implements MigrationInterface {
    name = 'createFileEntity1688381979477'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "file_uploadingstatus_enum" AS ENUM('failed', 'uploading', 'completed')`);
        await queryRunner.query(`CREATE TABLE "file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "filename" character varying NOT NULL, "mimetype" character varying NOT NULL, "location" character varying NOT NULL, "uploadingStatus" "file_uploadingstatus_enum" NOT NULL DEFAULT 'uploading', "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "file"`);
        await queryRunner.query(`DROP TYPE "file_uploadingstatus_enum"`);
    }

}
