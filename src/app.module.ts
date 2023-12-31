import { Module } from "@nestjs/common";
import { AppResolver } from "./app.resolver";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GraphQLModule } from "@nestjs/graphql";
import { join } from "path";
import { FileModule } from "./file/file.module";
import { UploadModule } from "./upload/upload.module";
import { DownloadModule } from "./download/download.module";
import * as typeOrmConfigration from "orm.config";

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfigration),
    GraphQLModule.forRoot({
      /**
       * disabled the default upload middleware
       * because it is vulnerable to CSRF attack
       */
      uploads: false,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
    }),
    FileModule,
    UploadModule,
    DownloadModule,
  ],
  providers: [AppService, AppResolver],
})
export class AppModule {}
