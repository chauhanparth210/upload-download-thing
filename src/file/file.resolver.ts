import { Args, ID, Mutation, Resolver } from "@nestjs/graphql";
import { FileService } from "./file.service";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { UploadFileResponse } from "./dto/upload-file.response";
import { DeleteFileResponse } from "./dto/delete-file.response";

@Resolver()
export class FileResolver {
  constructor(private readonly fileService: FileService) {}

  /**
   * Mutation endpoint to upload the supported file
   * @param {FileUpload} file
   * @return {Promise<UploadFileResponse>}
   * @memberof FileResolver
   */
  @Mutation(() => UploadFileResponse)
  uploadFile(
    @Args({ name: "file", type: () => GraphQLUpload })
    file: FileUpload
  ): Promise<UploadFileResponse> {
    return this.fileService.uploadFile(file);
  }

  /**
   * Mutation endpoint to delete file details from database and bucket
   * @param {ID} fileId
   * @return {Promise<DeleteFileResponse>}
   * @memberof FileResolver
   */
  @Mutation(() => DeleteFileResponse)
  deleteFile(
    @Args("fileId", { type: () => ID }) fileId: string
  ): Promise<DeleteFileResponse> {
    return this.fileService.deleteFile(fileId);
  }
}
