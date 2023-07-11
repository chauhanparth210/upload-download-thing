import { Injectable } from "@nestjs/common";
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
  async downloadFile(res: Response, fileId: string) {
    const fileObj = await this.fileRepository.findOne(fileId);

    // res.setHeader(
    //   "Content-disposition",
    //   "attachment; filename=" + fileObj.filename
    // );
    // res.setHeader("Content-type", fileObj.mimetype);
    const path = `${BUCKET_DIRECTORY}/${fileObj.filename}`;

    // const filestream = fs.createReadStream(path);
    // filestream.pipe(res);

    res.download(path);
  }
}
