import { Test, TestingModule } from "@nestjs/testing";
import { DownloadController } from "./download.controller";
import { DownloadService } from "./download.service";
import { response } from "express";

describe("DownloadController", () => {
  let controller: DownloadController;
  let downloadService: DownloadService;

  const fileID = "3dd6d207-066c-42e5-bbed-f40ce7355941";
  const fileName = "git-cheatsheet.pdf";

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DownloadController],
      providers: [
        {
          provide: "DownloadService",
          useValue: {
            downloadFile: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DownloadController>(DownloadController);
    downloadService = module.get(DownloadService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should call downloadFile method from download service", () => {
    controller.downloadFile(response, fileID);

    (downloadService.downloadFile as jest.Mock).mockReturnThis();

    expect(downloadService.downloadFile).toBeCalledTimes(1);
    expect(downloadService.downloadFile).toBeCalledWith(response, fileID);
  });
});
