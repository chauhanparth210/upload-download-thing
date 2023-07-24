import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { MESSAGE, UPLOAD_TYPE } from "src/constants";
import { getFilePath } from "src/utils";
import * as fs from "fs";
import { SUPPORTED_MAX_FILE_SIZE_IN_BYTES } from "src/config";
import { Repository } from "typeorm";
import { FileEntity } from "src/file/file.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { FileUpload } from "graphql-upload";

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>
  ) {}

  /**
   * Function to store the file on the bucket and save the file location
   * @param createReadStream stream to read the file
   * @param filename name of the file
   * @param fileId file identifier
   * @returns
   */
  storeFile({
    createReadStream,
    filename,
    fileId,
  }: {
    createReadStream: FileUpload["createReadStream"];
    filename: string;
    fileId: string;
  }) {
    try {
      const filePath = getFilePath(filename);
      let byteLength = 0;
      const fileReadStream = createReadStream();
      const writeStream = fs.createWriteStream(filePath);

      fileReadStream.on("data", (data: Buffer) => {
        byteLength += data.length;
        if (byteLength > SUPPORTED_MAX_FILE_SIZE_IN_BYTES) {
          fileReadStream.destroy(new Error(MESSAGE.BIG_FILE_SIZE));
        }
      });

      fileReadStream.on("error", (error) => {
        writeStream.destroy(error);
      });

      writeStream.on("finish", () => {
        this.fileRepository.update(
          { id: fileId },
          {
            uploadingStatus: UPLOAD_TYPE.COMPLETED,
            size: byteLength,
          }
        );
      });
      writeStream.on("error", (error) => {
        fs.unlink(filePath, () => {});
        this.fileRepository.update(
          { id: fileId },
          {
            uploadingStatus: UPLOAD_TYPE.FAILED,
            reasonOfFailure: error?.message,
          }
        );
      });

      fileReadStream.pipe(writeStream);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
