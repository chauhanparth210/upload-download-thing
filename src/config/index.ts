import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";

config();

const configService = new ConfigService();

export const SUPPORTED_MAX_FILE_SIZE = configService.get(
  "SUPPORTED_MAX_FILE_SIZE"
);
export const SUPPORTED_FILE_FORMETS: string[] = configService
  .get("SUPPORTED_FILE_FORMETS")
  .split(",");
