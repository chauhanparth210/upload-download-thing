import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnsupportedMediaTypeException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FileEntity } from "./file.entity";
import { Repository } from "typeorm";
import { UploadService } from "src/upload/upload.service";
import { SUPPORTED_FILE_FORMATS } from "src/config";
import { FileUpload } from "graphql-upload";
import { UploadFileResponse } from "./dto/upload-file.response";
import { DeleteFileResponse } from "./dto/delete-file.response";
import * as fs from "fs/promises";
import { getFilePath } from "src/utils";

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

  /**
   * Function to delete a file details from database and from bucket
   * @param fileId uuid from that file
   * @returns {Promise<DeleteFileResponse>}
   */
  async deleteFile(fileId: string): Promise<DeleteFileResponse> {
    try {
      const queryManager = this.fileRepository.manager;
      const deleteFileDetailsQuery = `DELETE FROM file WHERE id = '${fileId}' RETURNING *`;
      const rawData = await queryManager.query(deleteFileDetailsQuery);
      const deletedFileDetails: FileEntity = rawData[0][0];
      if (deletedFileDetails?.id) {
        const filenameOnBucket = deletedFileDetails?.filenameOnBucket;
        const filename = deletedFileDetails?.filename;
        const filePath = getFilePath(filenameOnBucket);
        await fs.unlink(filePath);
        return {
          message: `${filename} is successfully deleted!!`,
        };
      } else {
        throw new NotFoundException(
          `File details does not found associate with this ${fileId} uuid!!`
        );
      }
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }
}
