import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { storeFile } from "src/utils/store-file";
import { FileEntity } from "./file.entity";
import { Repository } from "typeorm";
import { BUCKET_DIRECTORY } from "src/constants";

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>
  ) {}

  async uploadFile(file) {
    console.log({ file });
    const { filename, mimetype, createReadStream } = file;

    // check for the supported file types

    // save the file details into our database
    const fileDetails = this.fileRepository.create({
      filename,
      mimetype,
      location: `${BUCKET_DIRECTORY}/${filename}`,
    });
    await this.fileRepository.insert(fileDetails);

    // handle the uplaod case
    const stream = createReadStream();
    storeFile({ stream, filename });

    return {
      fileId: fileDetails.id,
      message: `${filename} file is uploading...`,
    };
  }
}
