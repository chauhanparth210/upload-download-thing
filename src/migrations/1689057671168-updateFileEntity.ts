import { MigrationInterface, QueryRunner } from "typeorm";

export class updateFileEntity1689057671168 implements MigrationInterface {
  name = "updateFileEntity1689057671168";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "file" RENAME COLUMN "location" TO "filenameOnBucket"`
    );
    await queryRunner.query(
      `ALTER TABLE "file" ALTER COLUMN "filenameOnBucket" SET NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "file" ALTER COLUMN "filenameOnBucket" DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "file" RENAME COLUMN "filenameOnBucket" TO "location"`
    );
  }
}
