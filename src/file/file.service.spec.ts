import { Test, TestingModule } from "@nestjs/testing";
import { FileService } from "./file.service";
import { UploadFileResponse } from "./upload-file.response";
import { FileUpload } from "graphql-upload";
import { UploadService } from "src/upload/upload.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { FileEntity } from "./file.entity";
import { UnsupportedMediaTypeException } from "@nestjs/common";

jest.mock("src/config", () => ({
  SUPPORTED_FILE_FORMATS: ["application/pdf"],
}));

describe("FileService", () => {
  let fileService: FileService;
  let uploadService: UploadService;

  const fileRepository = {
    create: jest.fn(),
    insert: jest.fn(),
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
