import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { config } from "dotenv";
import { graphqlUploadExpress } from "graphql-upload";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";

config();

const BUCKET_DIRECTORY = "/file_bucker";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(graphqlUploadExpress());
  app.useStaticAssets(join(__dirname, "../..", BUCKET_DIRECTORY), {
    prefix: `/${BUCKET_DIRECTORY}`,
  });
  await app.listen(process.env.APPLICATION_PORT);
}
bootstrap();
