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

  /**
   * Function to store the file on the bucket and save the file location
   * @param fileReadStream ReadStream to read the file in small chunks
   * @param filename name of the file
   * @param fileId file identifier
   * @returns
   */
  storeFile({
    fileReadStream,
    filename,
    fileId,
  }: {
    fileReadStream;
    filename: string;
    fileId: string;
  }) {
    try {
      const filePath = getFilePath(filename);
      createDirIfNotExists(BUCKET_DIRECTORY);

      let byteLength = 0;
      fileReadStream
        .on("data", (data: Buffer) => {
          byteLength += data.length;
          if (byteLength > SUPPORTED_MAX_FILE_SIZE) {
            this.fileRepository.update(
              { id: fileId },
              {
                uploadingStatus: UPLOAD_TYPE.FAILED,
                reasonOfFailure: BIG_FILE_SIZE_ERROR_MESSAGE,
              }
            );
            // delete the truncated file & close the readsteam
            fs.unlink(filePath, () => {});
            fileReadStream.destroy();
          }
        })
        .pipe(fs.createWriteStream(filePath))
        .on("finish", () => {
          this.fileRepository.update(
            { id: fileId },
            {
              uploadingStatus: UPLOAD_TYPE.COMPLETED,
              size: byteLength,
              location: filePath,
            }
          );
        })
        .on("error", (error) => {
          this.fileRepository.update(
            { id: fileId },
            {
              uploadingStatus: UPLOAD_TYPE.FAILED,
            }
          );
          throw new Error(error);
        });
    } catch (error) {
      console.error({ error });
    }
  }
}
