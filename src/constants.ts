import { SUPPORTED_MAX_FILE_SIZE } from "src/config";

export const BUCKET_DIRECTORY = "file_bucket";

export enum UPLOAD_TYPE {
  FAILED = "failed",
  UPLOADING = "uploading",
  COMPLETED = "completed",
}

export const BIG_FILE_SIZE_ERROR_MESSAGE = `File size was exceeded more than ${SUPPORTED_MAX_FILE_SIZE}MBs`;

export const FILE_UPLOADING_MESSAGE = "Stay hang with us, file is uploading...";

export const FILE_FAILED_MESSAGE = "File was failed to upload";

export const FILE_NOT_FOUND_MESSAGE = "File is not found !!";
