import * as fs from "fs";
import { BUCKET_DIRECTORY } from "./constants";

export const getFilePath = (filename: string): string =>
  `${BUCKET_DIRECTORY}/${filename}`;

export const createDirIfNotExists = (dirName) =>
  !fs.existsSync(dirName) ? fs.mkdirSync(dirName) : undefined;
