import { Controller, Get, Param, Res } from "@nestjs/common";
import { DownloadService } from "./download.service";
import type { Response } from "express";

@Controller("download")
export class DownloadController {
  constructor(private downloadService: DownloadService) {}

  /**
   * Function controller to download a file
   * @param res Response of that request
   * @param fileId unique fileId
   * @returns
   */
  @Get(":fileId")
  downloadFile(@Res() res: Response, @Param("fileId") fileId: string) {
    return this.downloadService.downloadFile(res, fileId);
  }
}
