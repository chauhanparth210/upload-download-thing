import { Controller, Get, Param, Res } from "@nestjs/common";
import { DownloadService } from "./download.service";
import type { Response } from "express";

@Controller("download")
export class DownloadController {
  constructor(private downloadService: DownloadService) {}
  @Get(":fileid")
  downloadFile(@Res() res: Response, @Param("fileid") fileId: string) {
    return this.downloadService.downloadFile(res, fileId);
  }
}
