import * as fs from "fs";
import { BUCKET_DIRECTORY } from "../constants";

export const storeFile = ({ stream, filename }): Promise<{ path: string }> => {
  const path = `${BUCKET_DIRECTORY}/${filename}`;
  return new Promise((resolve, reject) =>
    stream
      .on("error", (error) => {
        if (stream.truncated) fs.unlinkSync(path);
        reject(error);
      })
      .pipe(fs.createWriteStream(path))
      .on("error", (error) => reject(error))
      .on("finish", () => resolve({ path }))
  );
};
