import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { Response } from "express";
import { FileEntity } from "src/file/file.entity";
import { Repository } from "typeorm";
import { BUCKET_DIRECTORY, MESSAGE, UPLOAD_TYPE } from "src/constants";

@Injectable()
export class DownloadService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>
  ) {}
  async downloadFile(res: Response, fileId: string): Promise<void> {
    try {
      const fileObj = await this.fileRepository.findOne(fileId);

      switch (fileObj?.uploadingStatus) {
        case UPLOAD_TYPE.COMPLETED:
          const path = `${BUCKET_DIRECTORY}/${fileObj.filenameOnBucket}`;
          res.download(path);
          break;

        case UPLOAD_TYPE.UPLOADING:
          res.json({
            message: MESSAGE.FILE_UPLOADING,
          });
          break;

        case UPLOAD_TYPE.FAILED:
          res.json({
            message: MESSAGE.FILE_UPLOAD_FAILED,
            reason: fileObj.reasonOfFailure,
          });
          break;

        default:
          throw new NotFoundException(MESSAGE.FILE_NOT_FOUND);
      }
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }
}
