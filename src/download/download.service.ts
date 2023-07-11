import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { Response } from "express";
import { FileEntity } from "src/file/file.entity";
import { Repository } from "typeorm";
import * as fs from "fs";
import { BUCKET_DIRECTORY } from "src/constants";

@Injectable()
export class DownloadService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>
  ) {}
  async downloadFile(res: Response, fileId: string): Promise<void> {
    try {
      const fileObj = await this.fileRepository.findOne(fileId);
      const path = `${BUCKET_DIRECTORY}/${fileObj.filenameOnBucket}`;
      res.download(path);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
