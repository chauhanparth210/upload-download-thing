import { Module } from "@nestjs/common";
import { DownloadController } from "./download.controller";
import { DownloadService } from "./download.service";
import { FileEntity } from "src/file/file.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  controllers: [DownloadController],
  providers: [DownloadService],
  imports: [TypeOrmModule.forFeature([FileEntity])],
})
export class DownloadModule {}
