const mockResponseFromFileRepository = {
  mimetype: "application/pdf",
  filenameOnBucket: "1689312279585_git-cheatsheet.pdf",
  uploadingStatus: "completed",
  size: 100194,
  reasonOfFailure: null,
  id: "3dd6d207-066c-42e5-bbed-f40ce7355941",
  filename: "git-cheatsheet.pdf",
};

const mockFile = {
  filename: "git-cheatsheet.pdf",
  mimetype: "application/pdf",
  encoding: "",
  createReadStream: jest.fn(),
};

const notSupportedMockFile = {
  filename: "my_photo.jpeg",
  mimetype: "image/jpeg",
  encoding: "",
  createReadStream: jest.fn(),
};

const fileId = "3dd6d207-066c-42e5-bbed-f40ce7355941";

const fileNotAssociatedWithUUID = "5bc6d207-066c-42e5-bbed-f40ce7355234";

const invalidFileId = "invalid_fileId";

const mockResponseFromDeleteFileMutation = {
  message: `${mockFile.filename} is successfully deleted!!`,
};

const mockResponseFromUploadFileMuation = {
  fileId,
  message: `${mockFile.filename} file is uploading...`,
};

export const MOCK_DATA = {
  mockResponseFromFileRepository,
  fileId,
  fileNotAssociatedWithUUID,
  invalidFileId,
  mockResponseFromDeleteFileMutation,
  mockFile,
  mockResponseFromUploadFileMuation,
  notSupportedMockFile,
};
