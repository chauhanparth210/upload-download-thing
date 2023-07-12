import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { Response } from "express";
import { FileEntity } from "src/file/file.entity";
import { Repository } from "typeorm";
import {
  BUCKET_DIRECTORY,
  FILE_FAILED_MESSAGE,
  FILE_NOT_FOUND_MESSAGE,
  FILE_UPLOADING_MESSAGE,
  UPLOAD_TYPE,
} from "src/constants";

@Injectable()
export class DownloadService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>
  ) {}
  async downloadFile(res: Response, fileId: string): Promise<void> {
    try {
      const fileObj = await this.fileRepository.findOne(fileId);

      switch (fileObj.uploadingStatus) {
        case UPLOAD_TYPE.COMPLETED:
          const path = `${BUCKET_DIRECTORY}/${fileObj.filenameOnBucket}`;
          res.download(path);
          break;

        case UPLOAD_TYPE.UPLOADING:
          res.send({
            message: FILE_UPLOADING_MESSAGE,
          });
          break;

        case UPLOAD_TYPE.FAILED:
          res.send({
            message: FILE_FAILED_MESSAGE,
            reason: fileObj.reasonOfFailure,
          });
          break;

        default:
          new Error(FILE_NOT_FOUND_MESSAGE);
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
