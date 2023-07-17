import { Test, TestingModule } from "@nestjs/testing";
import { FileResolver } from "./file.resolver";
import { FileService } from "./file.service";
import { MOCK_DATA } from "./mock";

jest.mock("src/config", () => ({
  SUPPORTED_FILE_FORMATS: ["application/pdf"],
}));

describe("FileResolver", () => {
  let fileResolver: FileResolver;
  let fileService: FileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileResolver,
        {
          provide: "FileService",
          useValue: {
            uploadFile: jest.fn(),
            deleteFile: jest.fn(),
          },
        },
      ],
    }).compile();

    fileResolver = module.get(FileResolver);
    fileService = module.get(FileService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(fileResolver).toBeDefined();
  });

  describe("uploadFile mutation", () => {
    it("should return the response from uploadFile mutation", async () => {
      (fileService.uploadFile as jest.Mock).mockResolvedValue(
        MOCK_DATA.mockResponseFromUploadFileMuation
      );

      const response = await fileResolver.uploadFile(MOCK_DATA.mockFile);
      expect(fileService.uploadFile).toBeCalledTimes(1);
      expect(fileService.uploadFile).toBeCalledWith(MOCK_DATA.mockFile);
      expect(response).toEqual(MOCK_DATA.mockResponseFromUploadFileMuation);
    });
  });

  describe("deleteFile mutation", () => {
    it("should return the response from uploadFile mutation", async () => {
      (fileService.deleteFile as jest.Mock).mockResolvedValue(
        MOCK_DATA.mockResponseFromDeleteFileMutation
      );

      const response = await fileResolver.deleteFile(MOCK_DATA.fileId);
      expect(fileService.deleteFile).toBeCalledTimes(1);
      expect(fileService.deleteFile).toBeCalledWith(MOCK_DATA.fileId);
      expect(response).toEqual(MOCK_DATA.mockResponseFromDeleteFileMutation);
    });
  });
});
