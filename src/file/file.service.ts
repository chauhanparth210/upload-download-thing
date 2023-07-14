import {
  Injectable,
  InternalServerErrorException,
  UnsupportedMediaTypeException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FileEntity } from "./file.entity";
import { Repository } from "typeorm";
import { UploadService } from "src/upload/upload.service";
import { SUPPORTED_FILE_FORMATS } from "src/config";
import { FileUpload } from "graphql-upload";
import { UploadFileResponse } from "./upload-file.response";

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private uploadService: UploadService
  ) {}

  /**
   * Function to upload supported file and save the file metadata
   * Uses {@link UploadService} to store the file on the bucket
   * @param file object of type `FileUpload`
   * @returns {Promise<UploadFileResponse>}
   */
  async uploadFile(file: FileUpload): Promise<UploadFileResponse> {
    try {
      const { filename, mimetype, createReadStream } = file;

      // check for the supported file types
      const isFileSupported = SUPPORTED_FILE_FORMATS.includes(mimetype);
      if (!isFileSupported) {
        throw new UnsupportedMediaTypeException(
          `${mimetype} file type is not supported`
        );
      }

      // save the file metadata
      const filenameOnBucket = `${new Date().getTime()}_${filename}`;
      const fileDetails = this.fileRepository.create({
        filename,
        mimetype,
        filenameOnBucket,
      });
      await this.fileRepository.insert(fileDetails);
      const fileId = fileDetails.id;

      const fileReadStream = createReadStream();
      this.uploadService.storeFile({
        fileReadStream,
        filename: filenameOnBucket,
        fileId,
      });

      return {
        fileId,
        message: `${filename} file is uploading...`,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
