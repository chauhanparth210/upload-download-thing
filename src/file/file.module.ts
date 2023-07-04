import { Module } from "@nestjs/common";
import { FileResolver } from "./file.resolver";
import { FileService } from "./file.service";
import { FileEntity } from "./file.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UploadService } from "src/upload/upload.service";

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  providers: [FileResolver, FileService, UploadService],
})
export class FileModule {}
