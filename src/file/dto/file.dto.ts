import { FilterableField, IDField } from "@nestjs-query/query-graphql";
import { ObjectType, ID, GraphQLISODateTime, Field } from "@nestjs/graphql";
import { UPLOAD_TYPE } from "src/constants";

@ObjectType("file")
export class FileDTO {
  @IDField(() => ID)
  id!: string;

  @FilterableField()
  filename!: string;

  @Field()
  mimetype!: string;

  @Field({ nullable: true })
  location: string;

  @FilterableField()
  uploadingStatus!: UPLOAD_TYPE;

  @Field({ nullable: true })
  size: number;

  @Field({ nullable: true })
  reasonOfFailure: string;

  @Field({ nullable: true })
  downloadLink: string;

  @Field(() => GraphQLISODateTime)
  created!: Date;

  @Field(() => GraphQLISODateTime)
  updated!: Date;
}
