import { UPLOAD_TYPE } from "src/constants";
import { FileAssembler } from "./file.assembler";

jest.mock("src/config", () => ({
  BASE_URL: "http://localhost:3000",
}));

describe("FileAssembler", () => {
  let date = new Date();

  it("should return downloadLink when file is uploaded successfully", () => {
    const assembler = new FileAssembler();
    expect(
      assembler.convertToDTO({
        id: "7dd79934-9ccc-425d-9d54-2e9f0a966c2c",
        filename: "Goal Setting Toolkit - 2023.pdf",
        filenameOnBucket: "1689147879874_Goal Setting Toolkit - 2023.pdf",
        mimetype: "application/pdf",
        uploadingStatus: UPLOAD_TYPE.COMPLETED,
        size: 1999750,
        reasonOfFailure: null,
        created: date,
        updated: date,
      })
    ).toEqual({
      id: "7dd79934-9ccc-425d-9d54-2e9f0a966c2c",
      filename: "Goal Setting Toolkit - 2023.pdf",
      filenameOnBucket: "1689147879874_Goal Setting Toolkit - 2023.pdf",
      downloadLink:
        "http://localhost:3000/download/7dd79934-9ccc-425d-9d54-2e9f0a966c2c",
      mimetype: "application/pdf",
      uploadingStatus: UPLOAD_TYPE.COMPLETED,
      size: 1999750,
      reasonOfFailure: null,
      created: date,
      updated: date,
    });
  });

  it("should return null when file is failed to upload", () => {
    const assembler = new FileAssembler();

    expect(
      assembler.convertToDTO({
        id: "7dd79934-9ccc-425d-9d54-2e9f0a966c2c",
        filename: "Goal Setting Toolkit - 2023.pdf",
        filenameOnBucket: "1689147879874_Goal Setting Toolkit - 2023.pdf",
        mimetype: "application/pdf",
        uploadingStatus: UPLOAD_TYPE.FAILED,
        size: 1999750,
        reasonOfFailure: null,
        created: date,
        updated: date,
      })
    ).toEqual({
      id: "7dd79934-9ccc-425d-9d54-2e9f0a966c2c",
      filename: "Goal Setting Toolkit - 2023.pdf",
      filenameOnBucket: "1689147879874_Goal Setting Toolkit - 2023.pdf",
      downloadLink: null,
      mimetype: "application/pdf",
      uploadingStatus: UPLOAD_TYPE.FAILED,
      size: 1999750,
      reasonOfFailure: null,
      created: date,
      updated: date,
    });
  });

  it("should return null when file is uploading", () => {
    const assembler = new FileAssembler();

    expect(
      assembler.convertToDTO({
        id: "7dd79934-9ccc-425d-9d54-2e9f0a966c2c",
        filename: "Goal Setting Toolkit - 2023.pdf",
        filenameOnBucket: "1689147879874_Goal Setting Toolkit - 2023.pdf",
        mimetype: "application/pdf",
        uploadingStatus: UPLOAD_TYPE.UPLOADING,
        size: 1999750,
        reasonOfFailure: null,
        created: date,
        updated: date,
      })
    ).toEqual({
      id: "7dd79934-9ccc-425d-9d54-2e9f0a966c2c",
      filename: "Goal Setting Toolkit - 2023.pdf",
      filenameOnBucket: "1689147879874_Goal Setting Toolkit - 2023.pdf",
      downloadLink: null,
      mimetype: "application/pdf",
      uploadingStatus: UPLOAD_TYPE.UPLOADING,
      size: 1999750,
      reasonOfFailure: null,
      created: date,
      updated: date,
    });
  });
});
