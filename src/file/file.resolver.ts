import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { FileService } from "./file.service";
import { GraphQLUpload } from "graphql-upload";
import { UploadFileResponse } from "./upload-file.response";

@Resolver()
export class FileResolver {
  constructor(private readonly fileService: FileService) {}

  @Mutation(() => UploadFileResponse)
  uploadFile(@Args({ name: "file", type: () => GraphQLUpload }) file) {
    return this.fileService.uploadFile(file);
  }
}