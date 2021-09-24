import "reflect-metadata";
import { ObjectType, Field, ID } from "type-graphql";
import { Post } from "./Post";

@ObjectType()
export class User {
  @Field((type) => ID)
  id: string;

  @Field((type) => String, { nullable: true })
  name?: string | null;

  @Field((type) => String)
  username: string;

  @Field((type) => [Post], { nullable: true })
  posts?: [Post] | null;
}

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;
}
