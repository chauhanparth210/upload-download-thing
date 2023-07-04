import { Module } from "@nestjs/common";
import { UploadService } from "./upload.service";
import { FileEntity } from "src/file/file.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
