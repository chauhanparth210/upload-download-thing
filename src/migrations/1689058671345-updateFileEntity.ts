import {MigrationInterface, QueryRunner} from "typeorm";

export class updateFileEntity1689058671345 implements MigrationInterface {
    name = 'updateFileEntity1689058671345'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" ADD CONSTRAINT "UQ_af852d5d712fbcfcc7f91241d05" UNIQUE ("filenameOnBucket")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "UQ_af852d5d712fbcfcc7f91241d05"`);
    }

}
