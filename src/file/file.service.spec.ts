import { Test, TestingModule } from "@nestjs/testing";
import { FileService } from "./file.service";
import { UploadFileResponse } from "./dto/upload-file.response";
import { FileUpload } from "graphql-upload";
import { UploadService } from "src/upload/upload.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { FileEntity } from "./file.entity";
import {
  BadRequestException,
  NotFoundException,
  UnsupportedMediaTypeException,
} from "@nestjs/common";
import * as fs from "fs/promises";

jest.mock("fs/promises");
jest.mock("src/config", () => ({
  SUPPORTED_FILE_FORMATS: ["application/pdf"],
}));

describe("FileService", () => {
  let fileService: FileService;
  let uploadService: UploadService;

  const fileRepository = {
    create: jest.fn(),
    insert: jest.fn(),
    manager: {
      query: jest.fn(),
    },
  };

  const FileDetails = {
    mimetype: "application/pdf",
    filenameOnBucket: "1689312279585_git-cheatsheet.pdf",
    uploadingStatus: "completed",
    size: 100194,
    reasonOfFailure: null,
    id: "3dd6d207-066c-42e5-bbed-f40ce7355941",
    filename: "git-cheatsheet.pdf",
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(FileEntity),
          useValue: fileRepository,
        },
        FileService,
        {
          provide: "UploadService",
          useValue: {
            storeFile: jest.fn(),
          },
        },
      ],
    }).compile();

    fileService = module.get(FileService);
    uploadService = module.get(UploadService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should be defined", () => {
    expect(fileService).toBeDefined();
  });

  describe("uploadFile mutation", () => {
    it("should return success response while uploading supported file", async () => {
      const mockResponse: UploadFileResponse = {
        fileId: "3dd6d207-066c-42e5-bbed-f40ce7355941",
        message: "git-cheatsheet.pdf file is uploading...",
      };

      const FileInput: FileUpload = {
        filename: "git-cheatsheet.pdf",
        mimetype: "application/pdf",
        encoding: "",
        createReadStream: jest.fn(),
      };

      jest.spyOn(fileRepository, "create").mockReturnValue({
        id: "3dd6d207-066c-42e5-bbed-f40ce7355941",
      });

      const response = await fileService.uploadFile(FileInput);

      expect(response).toEqual(mockResponse);
      expect(fileRepository.create).toBeCalledTimes(1);
      expect(fileRepository.insert).toBeCalledTimes(1);
      expect(FileInput.createReadStream).toBeCalledTimes(1);
      expect(uploadService.storeFile).toBeCalledTimes(1);
    });

    it("should return UnsupportedMediaType exception while uploading unsupported file", async () => {
      const FileInput: FileUpload = {
        filename: "my_photo.jpeg",
        mimetype: "image/jpeg",
        encoding: "",
        createReadStream: jest.fn(),
      };

      await expect(fileService.uploadFile(FileInput)).rejects.toThrow(
        new UnsupportedMediaTypeException(
          `${FileInput.mimetype} file type is not supported`
        )
      );
    });
  });

  describe("deleteFile mutation", () => {
    it("should return success response when file successfully deleted", async () => {
      const fileId = "3dd6d207-066c-42e5-bbed-f40ce7355941";

      jest
        .spyOn(fileRepository.manager, "query")
        .mockReturnValue([[FileDetails]]);

      const response = await fileService.deleteFile(fileId);

      expect(fileRepository.manager.query).toBeCalledWith(
        `DELETE FROM file WHERE id = '${fileId}' RETURNING *`
      );
      expect(fs.unlink).toBeCalledTimes(1);
      expect(fs.unlink).toBeCalledWith(
        `file_bucket/${FileDetails.filenameOnBucket}`
      );
      expect(response).toMatchObject({
        message: `${FileDetails.filename} is successfully deleted!!`,
      });
    });

    it("should return NotFoundException when file details is not found in database", async () => {
      const fileId = "5bc6d207-066c-42e5-bbed-f40ce7355234";

      jest.spyOn(fileRepository.manager, "query").mockReturnValue([[]]);

      await expect(fileService.deleteFile(fileId)).rejects.toThrow(
        new NotFoundException(
          `File details does not found associate with this ${fileId} uuid!!`
        )
      );
    });

    it("should return BadRequestException when fileId is not valid uuid", async () => {
      const fileId = "invalid_UUID";

      (fileRepository.manager.query as jest.Mock).mockRejectedValue(null);

      await expect(fileService.deleteFile(fileId)).rejects.toThrow(
        new BadRequestException()
      );
    });
  });
});
