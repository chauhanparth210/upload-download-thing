import {MigrationInterface, QueryRunner} from "typeorm";

export class updateFileEntity1688453980408 implements MigrationInterface {
    name = 'updateFileEntity1688453980408'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" ADD "size" integer`);
        await queryRunner.query(`ALTER TABLE "file" ADD "reasonForFailed" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "reasonForFailed"`);
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "size"`);
    }

}
