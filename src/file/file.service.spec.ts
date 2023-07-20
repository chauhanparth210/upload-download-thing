import { Test, TestingModule } from "@nestjs/testing";
import { FileService } from "./file.service";
import { UploadService } from "src/upload/upload.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { FileEntity } from "./file.entity";
import {
  BadRequestException,
  NotFoundException,
  UnsupportedMediaTypeException,
} from "@nestjs/common";
import * as fs from "fs/promises";
import { MOCK_DATA } from "./mock";
import { mockFileRepository } from "src/__mocks__";

jest.mock("fs/promises");
jest.mock("src/config", () => ({
  SUPPORTED_FILE_FORMATS: ["application/pdf"],
}));

describe("FileService", () => {
  let fileService: FileService;
  let uploadService: UploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(FileEntity),
          useValue: mockFileRepository,
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
      jest.spyOn(mockFileRepository, "create").mockReturnValue({
        id: MOCK_DATA.fileId,
      });

      const response = await fileService.uploadFile(MOCK_DATA.mockFile);

      expect(response).toEqual(MOCK_DATA.mockResponseFromUploadFileMuation);
      expect(mockFileRepository.create).toBeCalledTimes(1);
      expect(mockFileRepository.insert).toBeCalledTimes(1);
      expect(MOCK_DATA.mockFile.createReadStream).toBeCalledTimes(1);
      expect(uploadService.storeFile).toBeCalledTimes(1);
    });

    it("should return UnsupportedMediaType exception while uploading unsupported file", async () => {
      await expect(
        fileService.uploadFile(MOCK_DATA.notSupportedMockFile)
      ).rejects.toThrow(
        new UnsupportedMediaTypeException(
          `${MOCK_DATA.notSupportedMockFile.mimetype} file type is not supported`
        )
      );
    });
  });

  describe("deleteFile mutation", () => {
    it("should return success response when file successfully deleted", async () => {
      jest
        .spyOn(mockFileRepository.manager, "query")
        .mockReturnValue([[MOCK_DATA.mockResponseFromFileRepository]]);

      const response = await fileService.deleteFile(MOCK_DATA.fileId);

      expect(mockFileRepository.manager.query).toBeCalledWith(
        `DELETE FROM file WHERE id = '${MOCK_DATA.fileId}' RETURNING *`
      );
      expect(fs.unlink).toBeCalledTimes(1);
      expect(fs.unlink).toBeCalledWith(
        `file_bucket/${MOCK_DATA.mockResponseFromFileRepository.filenameOnBucket}`
      );
      expect(response).toMatchObject({
        message: `${MOCK_DATA.mockResponseFromFileRepository.filename} is successfully deleted!!`,
      });
    });

    it("should return NotFoundException when file details is not found in database", async () => {
      jest.spyOn(mockFileRepository.manager, "query").mockReturnValue([[]]);

      await expect(
        fileService.deleteFile(MOCK_DATA.fileNotAssociatedWithUUID)
      ).rejects.toThrow(
        new NotFoundException(
          `File details does not found associate with this ${MOCK_DATA.fileNotAssociatedWithUUID} uuid!!`
        )
      );
    });

    it("should return BadRequestException when fileId is not valid uuid", async () => {
      (mockFileRepository.manager.query as jest.Mock).mockRejectedValue(null);

      await expect(
        fileService.deleteFile(MOCK_DATA.invalidFileId)
      ).rejects.toThrow(new BadRequestException());
    });
  });
});
