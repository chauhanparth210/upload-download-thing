import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UploadFileResponse {
  @Field()
  message!: string;

  @Field()
  fileId!: string;
}
