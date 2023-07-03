import { Injectable } from "@nestjs/common";
import { storeFile } from "src/utils/store-file";

@Injectable()
export class FileService {
  async uploadFile(file) {
    console.log({ file });
    const { filename, createReadStream } = file;
    const stream = createReadStream();
    const fileLocation = await storeFile({ stream, filename });
    return `uploaded file && location:${fileLocation.path}`;
  }
}
