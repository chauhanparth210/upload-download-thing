const mockResponseFromFileRepository = {
  mimetype: "application/pdf",
  filenameOnBucket: "1689312279585_git-cheatsheet.pdf",
  uploadingStatus: "completed",
  size: 100194,
  reasonOfFailure: null,
  id: "3dd6d207-066c-42e5-bbed-f40ce7355941",
  filename: "git-cheatsheet.pdf",
};

const fileId = "3dd6d207-066c-42e5-bbed-f40ce7355941";

const fileNotAssociatedWithUUID = "5bc6d207-066c-42e5-bbed-f40ce7355234";

const invalidFileId = "invalid_fileId";

const mockResponseFromDeleteFileMutation = {
  message: `${mockResponseFromFileRepository.filename} is successfully deleted!!`,
};

export const MOCK_DATA = {
  mockResponseFromFileRepository,
  fileId,
  fileNotAssociatedWithUUID,
  invalidFileId,
  mockResponseFromDeleteFileMutation,
};
