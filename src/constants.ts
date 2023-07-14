import { SUPPORTED_MAX_FILE_SIZE } from "src/config";

export const BUCKET_DIRECTORY = "file_bucket";

export enum UPLOAD_TYPE {
  FAILED = "failed",
  UPLOADING = "uploading",
  COMPLETED = "completed",
}

export const BIG_FILE_SIZE_ERROR_MESSAGE = `file size was exceeded more than ${SUPPORTED_MAX_FILE_SIZE}MBs`;
