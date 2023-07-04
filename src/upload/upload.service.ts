import { Injectable } from "@nestjs/common";
import {
  BIG_FILE_SIZE_ERROR_MESSAGE,
  BUCKET_DIRECTORY,
  UPLOAD_TYPE,
} from "src/constants";
import { createDirIfNotExists, getFilePath } from "src/utils";
import * as fs from "fs";
import { SUPPORTED_MAX_FILE_SIZE } from "src/config";
import { Repository } from "typeorm";
import { FileEntity } from "src/file/file.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>
  ) {}

  storeFile({ fileReadableStream, filename, fileId }) {
    const filePath = getFilePath(filename);
    createDirIfNotExists(BUCKET_DIRECTORY);

    let byteLength = 0;
    fileReadableStream
      .on("data", (data: Buffer) => {
        byteLength += data.length;
        if (byteLength > SUPPORTED_MAX_FILE_SIZE) {
          fileReadableStream.destroy();
          // delete the truncated file
          fs.unlink(filePath, (err) => {
            if (err) throw err;
          });
          this.fileRepository.update(
            { id: fileId },
            {
              uploadingStatus: UPLOAD_TYPE.FAILED,
              reasonForFailed: BIG_FILE_SIZE_ERROR_MESSAGE,
            }
          );
        }
      })
      .pipe(fs.createWriteStream(filePath))
      .on("finish", () => {
        this.fileRepository.update(
          { id: fileId },
          {
            uploadingStatus: UPLOAD_TYPE.COMPLETED,
            size: byteLength,
          }
        );
      })
      .on("error", (error) => {
        console.log({ error });
      });
  }
}
