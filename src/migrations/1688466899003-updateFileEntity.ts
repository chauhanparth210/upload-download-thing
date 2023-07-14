import {MigrationInterface, QueryRunner} from "typeorm";

export class updateFileEntity1688466899003 implements MigrationInterface {
    name = 'updateFileEntity1688466899003'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" RENAME COLUMN "reasonForFailed" TO "reasonOfFailure"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" RENAME COLUMN "reasonOfFailure" TO "reasonForFailed"`);
    }

}
