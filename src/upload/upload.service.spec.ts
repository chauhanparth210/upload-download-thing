import { Test, TestingModule } from "@nestjs/testing";
import { UploadService } from "./upload.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { FileEntity } from "src/file/file.entity";
import * as fs from "fs";
import { WriteStream } from "fs-capacitor";
import { MESSAGE, UPLOAD_TYPE } from "src/constants";
import { mocked } from "ts-jest/utils";
import { MOCK_DATA } from "src/file/mock";
import { mockFileRepository } from "src/__mocks__";

jest.mock("fs");
jest.mock("src/utils", () => ({
  getFilePath: () => `temp/git-cheatsheet.pdf`,
  createDirIfNotExists: () => {},
}));
jest.mock("src/config", () => ({
  SUPPORTED_MAX_FILE_SIZE_IN_BYTES: 10,
  SUPPORTED_MAX_FILE_SIZE: 10 / 1000000,
}));

describe("UploadService", () => {
  let service: UploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        {
          provide: getRepositoryToken(FileEntity),
          useValue: mockFileRepository,
        },
      ],
    }).compile();

    service = module.get<UploadService>(UploadService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should save success message on successful file upload", () => {
    const mockWriteStream = new WriteStream();
    mockWriteStream.pipe = jest.fn();

    mocked(fs).createWriteStream.mockReturnValue(mockWriteStream);
    mocked(mockWriteStream).pipe.mockReturnThis();

    service.storeFile({
      createReadStream: () => mockWriteStream,
      filename: MOCK_DATA.mockFile.filename,
      fileId: MOCK_DATA.fileId,
    });

    mockWriteStream.emit("data", "valid file");
    mockWriteStream.emit("finish");

    expect(mockFileRepository.update).toBeCalledTimes(1);
    expect(mockFileRepository.update).toBeCalledWith(
      { id: MOCK_DATA.fileId },
      {
        uploadingStatus: UPLOAD_TYPE.COMPLETED,
        size: 10,
      }
    );
  });

  it("should update database when the file size was big", () => {
    const mockWriteStream = new WriteStream();
    mockWriteStream.pipe = jest.fn();
    mockWriteStream.destroy = jest.fn();

    mocked(fs).createWriteStream.mockReturnValue(mockWriteStream);
    mocked(fs).unlink.mockReturnValue();
    mocked(mockWriteStream).pipe.mockReturnThis();
    mocked(mockWriteStream).destroy.mockImplementationOnce((error: Error) => {
      mockWriteStream.emit("error", error);
    });

    service.storeFile({
      createReadStream: () => mockWriteStream,
      filename: MOCK_DATA.mockFile.filename,
      fileId: MOCK_DATA.fileId,
    });

    mockWriteStream.emit("data", "file is too big");

    expect(mockFileRepository.update).toBeCalledTimes(1);
    expect(mockFileRepository.update).toBeCalledWith(
      { id: MOCK_DATA.fileId },
      {
        uploadingStatus: UPLOAD_TYPE.FAILED,
        reasonOfFailure: MESSAGE.BIG_FILE_SIZE,
      }
    );
    expect(fs.unlink).toBeCalledTimes(1);
  });

  it("should throw error when steam having issue", () => {
    const mockWriteStream = new WriteStream();
    mockWriteStream.pipe = jest.fn();

    mocked(fs).createWriteStream.mockReturnValue(mockWriteStream);
    mocked(mockWriteStream).pipe.mockReturnThis();

    service.storeFile({
      createReadStream: () => mockWriteStream,
      filename: MOCK_DATA.mockFile.filename,
      fileId: MOCK_DATA.fileId,
    });

    mockWriteStream.emit("data", "valid file");
    mockWriteStream.emit("error", new Error("stream failed"));

    expect(mockFileRepository.update).toBeCalledTimes(1);
    expect(mockFileRepository.update).toBeCalledWith(
      { id: MOCK_DATA.fileId },
      {
        uploadingStatus: UPLOAD_TYPE.FAILED,
        reasonOfFailure: "stream failed",
      }
    );
  });
});
