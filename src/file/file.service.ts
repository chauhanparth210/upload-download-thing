import { Injectable, UnsupportedMediaTypeException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { getFilePath } from "src/utils";
import { FileEntity } from "./file.entity";
import { Repository } from "typeorm";
import { UploadService } from "src/upload/upload.service";
import { SUPPORTED_FILE_FORMETS } from "src/config";
import { FileUpload } from "graphql-upload";

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private uploadService: UploadService
  ) {}

  async uploadFile(file: FileUpload) {
    const { filename, mimetype, createReadStream } = file;

    // check for the supported file types
    const isFileSupported = SUPPORTED_FILE_FORMETS.includes(mimetype);
    if (!isFileSupported) {
      throw new UnsupportedMediaTypeException(
        `${mimetype} file type is not supported`
      );
    }

    // save the file details into database
    const fileDetails = this.fileRepository.create({
      filename,
      mimetype,
    });
    await this.fileRepository.insert(fileDetails);
    const fileId = fileDetails.id;

    const fileReadableStream = createReadStream();
    this.uploadService.storeFile({
      fileReadableStream,
      filename,
      fileId,
    });

    return {
      fileId,
      message: `${filename} file is uploading...`,
    };
  }
}
