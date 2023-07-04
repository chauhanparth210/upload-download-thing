import { Injectable } from "@nestjs/common";
import { BUCKET_DIRECTORY } from "src/constants";
import { createDirIfNotExists, getFilePath } from "src/utils";
import * as fs from "fs";

@Injectable()
export class UploadService {
  storeFile({ fileReadableStream, filename, fileId }) {
    const filePath = getFilePath(filename);

    let byteLength = 0;
    const MaxFileSize = 1000 * 10000000;
    createDirIfNotExists(BUCKET_DIRECTORY);

    fileReadableStream
      .on("data", (data: Buffer) => {
        byteLength += data.length;
        if (byteLength > MaxFileSize) {
          console.log("error_file_size");
          fileReadableStream.destroy();
          // delete the truncated file
          fs.unlink(filePath, (err) => {
            if (err) throw err;
            console.log(`${filePath} was deleted`);
          });
        }
      })
      .pipe(fs.createWriteStream(filePath))
      .on("error", (error) => {
        /**
         * not supported file
         * file size excided
         */
      })
      .on("finish", () => {
        console.log("finished");
      });
  }
}
