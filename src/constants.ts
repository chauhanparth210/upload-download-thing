import { SUPPORTED_MAX_FILE_SIZE } from "src/config";

export const BUCKET_DIRECTORY = "file_bucket";

export enum UPLOAD_TYPE {
  FAILED = "failed",
  UPLOADING = "uploading",
  COMPLETED = "completed",
}

export const MESSAGE = {
  FILE_UPLOADING: "Stay hang with us, file is uploading...",
  FILE_UPLOAD_FAILED: "File was failed to upload",
  FILE_NOT_FOUND: "File is not found !!",
  BIG_FILE_SIZE: `File size was exceeded more than ${SUPPORTED_MAX_FILE_SIZE}MBs`,
};
