import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class DeleteFileResponse {
  @Field({ nullable: true })
  message: string;
}
