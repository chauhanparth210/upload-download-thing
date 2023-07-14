import { Test, TestingModule } from "@nestjs/testing";
import { DownloadService } from "./download.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { FileEntity } from "src/file/file.entity";
import { BUCKET_DIRECTORY, MESSAGE, UPLOAD_TYPE } from "src/constants";
import { response } from "express";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe("DownloadService", () => {
  let downloadService: DownloadService;

  const fileRepository = {
    findOne: jest.fn(),
  };

  const fileID = "3dd6d207-066c-42e5-bbed-f40ce7355941";
  const fileName = "git-cheatsheet.pdf";

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(FileEntity),
          useValue: fileRepository,
        },
        DownloadService,
      ],
    }).compile();

    downloadService = module.get<DownloadService>(DownloadService);
  });

  it("should be defined", () => {
    expect(downloadService).toBeDefined();
  });

  it("should call the download method in successful file upload", async () => {
    const filenameOnBucket = `${new Date().getTime()}_${fileName}`;
    const uploadingStatus = UPLOAD_TYPE.COMPLETED;

    jest.spyOn(fileRepository, "findOne").mockReturnValue({
      filenameOnBucket,
      uploadingStatus,
    });
    jest.spyOn(response, "download").mockReturnThis();

    await downloadService.downloadFile(response, fileID);

    expect(fileRepository.findOne).toBeCalledWith(fileID);
    expect(response.download).toBeCalledTimes(1);
    expect(response.download).toBeCalledWith(
      `${BUCKET_DIRECTORY}/${filenameOnBucket}`
    );
  });

  it("should call the send method with proper message when file is uploading", async () => {
    const filenameOnBucket = `${new Date().getTime()}_${fileName}`;
    const uploadingStatus = UPLOAD_TYPE.UPLOADING;

    jest.spyOn(fileRepository, "findOne").mockReturnValue({
      filenameOnBucket,
      uploadingStatus,
    });
    jest.spyOn(response, "json").mockReturnThis();

    await downloadService.downloadFile(response, fileID);

    expect(fileRepository.findOne).toBeCalledWith(fileID);
    expect(response.json).toBeCalledTimes(1);
    expect(response.json).toBeCalledWith({
      message: MESSAGE.FILE_UPLOADING,
    });
  });

  it("should call the send method with appropriate message when file was failed to upload", async () => {
    const filenameOnBucket = `${new Date().getTime()}_${fileName}`;
    const uploadingStatus = UPLOAD_TYPE.FAILED;
    const reasonOfFailure = "File was failed to upload";

    jest.spyOn(fileRepository, "findOne").mockReturnValue({
      filenameOnBucket,
      uploadingStatus,
      reasonOfFailure,
    });
    jest.spyOn(response, "json").mockReturnThis();

    await downloadService.downloadFile(response, fileID);

    expect(fileRepository.findOne).toBeCalledWith(fileID);
    expect(response.json).toBeCalledTimes(1);
    expect(response.json).toBeCalledWith({
      message: MESSAGE.FILE_UPLOAD_FAILED,
      reason: reasonOfFailure,
    });
  });

  it("should return BadRequestException when fileId is invalid", async () => {
    const invalidFileId = "test_file_id";
    (fileRepository.findOne as jest.Mock).mockRejectedValue(null);
    jest.spyOn(response, "json").mockReturnThis();

    await expect(
      downloadService.downloadFile(response, invalidFileId)
    ).rejects.toThrow(new BadRequestException());
  });

  it("should return NotFoundException when file is not found", async () => {
    (fileRepository.findOne as jest.Mock).mockReturnValue({
      uploadingStatus: null,
    });
    jest.spyOn(response, "json").mockReturnThis();

    await expect(
      downloadService.downloadFile(response, fileID)
    ).rejects.toThrow(new NotFoundException(MESSAGE.FILE_NOT_FOUND));
  });
});
