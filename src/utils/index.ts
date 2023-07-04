import * as fs from "fs";
import { BUCKET_DIRECTORY } from "../constants";

export const getFilePath = (filename: string): string =>
  `${BUCKET_DIRECTORY}/${filename}`;

export const createDirIfNotExists = (dirName) =>
  !fs.existsSync(dirName) ? fs.mkdirSync(dirName) : undefined;

export const bytesToFileSize = (bytes: number, decimals = 0): string => {
  if (!+bytes) return "0 Bytes";

  const k = 1000;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};
