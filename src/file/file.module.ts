import { Module } from "@nestjs/common";
import { FileResolver } from "./file.resolver";
import { FileService } from "./file.service";
import { FileEntity } from "./file.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UploadService } from "src/upload/upload.service";
import { NestjsQueryGraphQLModule } from "@nestjs-query/query-graphql";
import { FileDTO } from "./dto/file.dto";
import { NestjsQueryTypeOrmModule } from "@nestjs-query/query-typeorm";
import { FileAssembler } from "./file.assembler";

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([FileEntity])],
      assemblers: [FileAssembler],
      resolvers: [
        {
          DTOClass: FileDTO,
          EntityClass: FileEntity,
          AssemblerClass: FileAssembler,
          create: { disabled: true },
          update: { disabled: true },
          delete: { disabled: true },
        },
      ],
    }),
  ],
  providers: [FileResolver, FileService, UploadService],
})
export class FileModule {}
