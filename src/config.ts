import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";

config();

const configService = new ConfigService();

export const SUPPORTED_MAX_FILE_SIZE = configService.get(
  "SUPPORTED_MAX_FILE_SIZE"
);

export const SUPPORTED_MAX_FILE_SIZE_IN_BYTES: number =
  parseInt(SUPPORTED_MAX_FILE_SIZE) * 1000000;

export const SUPPORTED_FILE_FORMATS: string[] = configService
  .get("SUPPORTED_FILE_FORMATS")
  .split(",");

export const BASE_URL = configService.get("BASE_URL");
