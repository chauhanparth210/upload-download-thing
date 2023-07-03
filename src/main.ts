import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { config } from "dotenv";
import { graphqlUploadExpress } from "graphql-upload";

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(graphqlUploadExpress());
  await app.listen(process.env.APPLICATION_PORT);
}
bootstrap();
