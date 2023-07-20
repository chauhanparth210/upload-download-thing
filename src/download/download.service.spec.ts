import { Test, TestingModule } from "@nestjs/testing";
import { DownloadService } from "./download.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { FileEntity } from "src/file/file.entity";
import { BUCKET_DIRECTORY, MESSAGE, UPLOAD_TYPE } from "src/constants";
import { response } from "express";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { mockFileRepository } from "src/__mocks__";
import { MOCK_DATA } from "./mock";

describe("DownloadService", () => {
  let downloadService: DownloadService;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(FileEntity),
          useValue: mockFileRepository,
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
    const uploadingStatus = UPLOAD_TYPE.COMPLETED;

    jest.spyOn(mockFileRepository, "findOne").mockReturnValue({
      filenameOnBucket: MOCK_DATA.filenameOnBucket,
      uploadingStatus,
    });
    jest.spyOn(response, "download").mockReturnThis();

    await downloadService.downloadFile(response, MOCK_DATA.fileId);

    expect(mockFileRepository.findOne).toBeCalledWith(MOCK_DATA.fileId);
    expect(response.download).toBeCalledTimes(1);
    expect(response.download).toBeCalledWith(
      `${BUCKET_DIRECTORY}/${MOCK_DATA.filenameOnBucket}`
    );
  });

  it("should call the send method with proper message when file is uploading", async () => {
    const uploadingStatus = UPLOAD_TYPE.UPLOADING;

    jest.spyOn(mockFileRepository, "findOne").mockReturnValue({
      filenameOnBucket: MOCK_DATA.filenameOnBucket,
      uploadingStatus,
    });
    jest.spyOn(response, "json").mockReturnThis();

    await downloadService.downloadFile(response, MOCK_DATA.fileId);

    expect(mockFileRepository.findOne).toBeCalledWith(MOCK_DATA.fileId);
    expect(response.json).toBeCalledTimes(1);
    expect(response.json).toBeCalledWith({
      message: MESSAGE.FILE_UPLOADING,
    });
  });

  it("should call the send method with appropriate message when file was failed to upload", async () => {
    const uploadingStatus = UPLOAD_TYPE.FAILED;

    jest.spyOn(mockFileRepository, "findOne").mockReturnValue({
      filenameOnBucket: MOCK_DATA.filenameOnBucket,
      uploadingStatus,
      reasonOfFailure: MESSAGE.FILE_UPLOAD_FAILED,
    });
    jest.spyOn(response, "json").mockReturnThis();

    await downloadService.downloadFile(response, MOCK_DATA.fileId);

    expect(mockFileRepository.findOne).toBeCalledWith(MOCK_DATA.fileId);
    expect(response.json).toBeCalledTimes(1);
    expect(response.json).toBeCalledWith({
      message: MESSAGE.FILE_UPLOAD_FAILED,
      reason: MESSAGE.FILE_UPLOAD_FAILED,
    });
  });

  it("should return BadRequestException when fileId is invalid", async () => {
    (mockFileRepository.findOne as jest.Mock).mockRejectedValue(null);
    jest.spyOn(response, "json").mockReturnThis();

    await expect(
      downloadService.downloadFile(response, MOCK_DATA.invalidFileId)
    ).rejects.toThrow(new BadRequestException());
  });

  it("should return NotFoundException when file is not found", async () => {
    (mockFileRepository.findOne as jest.Mock).mockReturnValue({
      uploadingStatus: null,
    });
    jest.spyOn(response, "json").mockReturnThis();

    await expect(
      downloadService.downloadFile(response, MOCK_DATA.fileId)
    ).rejects.toThrow(new NotFoundException(MESSAGE.FILE_NOT_FOUND));
  });
});
