import { MigrationInterface, QueryRunner } from "typeorm";

export class updateFileEntity1688533160093 implements MigrationInterface {
  name = "updateFileEntity1688533160093";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "file" ALTER COLUMN "location" DROP NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "file" ALTER COLUMN "location" SET NOT NULL`
    );
  }
}
