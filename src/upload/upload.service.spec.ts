import { Test, TestingModule } from "@nestjs/testing";
import { UploadService } from "./upload.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { FileEntity } from "src/file/file.entity";

describe("UploadService", () => {
  let service: UploadService;

  const fileRepository = {
    update: jest.fn(),
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

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
