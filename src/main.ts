import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { config } from "dotenv";
import { graphqlUploadExpress } from "graphql-upload";
import { createDirIfNotExists } from "./utils";
import { BUCKET_DIRECTORY } from "./constants";

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(graphqlUploadExpress());
  createDirIfNotExists(BUCKET_DIRECTORY);
  await app.listen(process.env.APPLICATION_PORT);
}
bootstrap();
