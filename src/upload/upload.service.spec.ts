import { Test, TestingModule } from "@nestjs/testing";
import { UploadService } from "./upload.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { FileEntity } from "src/file/file.entity";
import * as fs from "fs";
import { WriteStream } from "fs-capacitor";
import { BIG_FILE_SIZE_ERROR_MESSAGE, UPLOAD_TYPE } from "src/constants";
import { mocked } from "ts-jest/utils";

jest.mock("fs");
jest.mock("src/utils", () => ({
  getFilePath: () => `temp/git-cheatsheet.pdf`,
  createDirIfNotExists: () => {},
}));
jest.mock("src/config", () => ({
  SUPPORTED_MAX_FILE_SIZE: 10,
}));

describe("UploadService", () => {
  let service: UploadService;

  const fileRepository = {
    update: jest.fn(),
  };

  const FileInputs = {
    filename: "git-cheatsheet.pdf",
    fileId: "3dd6d207-066c-42e5-bbed-f40ce7355941",
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        {
          provide: getRepositoryToken(FileEntity),
          useValue: fileRepository,
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
    const fileReadStream = mockWriteStream.createReadStream();

    const newFileReadStream = fileReadStream;
    newFileReadStream.pipe = jest.fn();

    mocked(fs).createWriteStream.mockReturnValue(mockWriteStream);
    mocked(newFileReadStream).pipe.mockReturnThis();

    service.storeFile({
      fileReadStream: newFileReadStream,
      filename: FileInputs.filename,
      fileId: FileInputs.fileId,
    });

    fileReadStream.emit("data", "valid file");
    fileReadStream.emit("finish");

    expect(fileRepository.update).toBeCalledTimes(1);
    expect(fileRepository.update).toBeCalledWith(
      { id: FileInputs.fileId },
      {
        uploadingStatus: UPLOAD_TYPE.COMPLETED,
        size: 10,
      }
    );
  });

  it("should update database when the file size was big", () => {
    const mockWriteStream = new WriteStream();
    const fileReadStream = mockWriteStream.createReadStream();

    const newFileReadStream = fileReadStream;
    newFileReadStream.pipe = jest.fn();

    mocked(fs).createWriteStream.mockReturnValue(mockWriteStream);
    mocked(fs).unlink.mockReturnValue();
    mocked(newFileReadStream).pipe.mockReturnThis();

    service.storeFile({
      fileReadStream: newFileReadStream,
      filename: FileInputs.filename,
      fileId: FileInputs.fileId,
    });

    fileReadStream.emit("data", "file is too big");

    expect(fileRepository.update).toBeCalledTimes(1);
    expect(fileRepository.update).toBeCalledWith(
      { id: FileInputs.fileId },
      {
        uploadingStatus: UPLOAD_TYPE.FAILED,
        reasonOfFailure: BIG_FILE_SIZE_ERROR_MESSAGE,
      }
    );
    expect(fs.unlink).toBeCalledTimes(1);
  });

  it("should throw error when steam having issue", () => {
    const mockWriteStream = new WriteStream();
    const fileReadStream = mockWriteStream.createReadStream();

    const newFileReadStream = fileReadStream;
    newFileReadStream.pipe = jest.fn();

    mocked(fs).createWriteStream.mockReturnValue(mockWriteStream);
    mocked(fs).unlink.mockReturnValue();
    mocked(newFileReadStream).pipe.mockReturnThis();

    service.storeFile({
      fileReadStream: newFileReadStream,
      filename: FileInputs.filename,
      fileId: FileInputs.fileId,
    });

    fileReadStream.emit("data", "valid file");
    fileReadStream.emit("error", new Error("stream failed"));

    expect(fileRepository.update).toBeCalledTimes(1);
    expect(fileRepository.update).toBeCalledWith(
      { id: FileInputs.fileId },
      {
        uploadingStatus: UPLOAD_TYPE.FAILED,
        reasonOfFailure: "stream failed",
      }
    );
  });
});
