import "reflect-metadata";
import { ObjectType, Field, ID, Int } from "type-graphql";
import { User } from "./User";

@ObjectType()
export class Post {
  @Field((type) => ID)
  id: string;

  @Field((type) => Date)
  createdAt: Date;

  @Field((type) => Date)
  updatedAt: Date;

  @Field((type) => String, { nullable: true })
  description: string | null;

  @Field((type) => Int)
  viewCount: number;

  @Field((type) => User, { nullable: true })
  author?: User | null;

  @Field((type) => Int)
  likes?: number;
}
