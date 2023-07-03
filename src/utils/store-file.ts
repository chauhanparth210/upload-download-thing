import * as fs from "fs";
import { BUCKET_DIRECTORY } from "../constants";

export const getFilePath = (filename: string): string =>
  `${BUCKET_DIRECTORY}/${filename}`;

export const storeFile = ({ stream, filename }) => {
  const filePath = getFilePath(filename);
  stream
    .on("error", (error) => {
      if (stream.truncated) fs.unlinkSync(filePath);
    })
    .pipe(fs.createWriteStream(filePath))
    .on("error", (error) => {})
    .on("finish", () => {});
};
