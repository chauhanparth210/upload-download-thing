import { Module } from "@nestjs/common";
import { FileResolver } from "./file.resolver";
import { FileService } from "./file.service";
import { FileEntity } from "./file.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UploadService } from "src/upload/upload.service";
import { NestjsQueryGraphQLModule } from "@nestjs-query/query-graphql";
import { FileDTO } from "./dto/file.dto";
import { NestjsQueryTypeOrmModule } from "@nestjs-query/query-typeorm";

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([FileEntity])],
      resolvers: [
        {
          DTOClass: FileDTO,
          EntityClass: FileEntity,
          create: { disabled: true },
          update: { disabled: true },
          delete: { many: { disabled: true } },
        },
      ],
    }),
  ],
  providers: [FileResolver, FileService, UploadService],
})
export class FileModule {}
