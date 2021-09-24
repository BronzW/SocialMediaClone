import "reflect-metadata";
import { Resolver, Query, Mutation, Arg, Ctx, FieldResolver, Root, InputType, Field } from "type-graphql";
import { Post } from "./Post";
import { User } from "./User";
import { Context } from "./context";
@InputType()
export class PostCreateInput {
  @Field({ nullable: true })
  description: string;
}

@InputType()
class PostOrderByUpdatedAtInput {
  @Field((type) => SortOrder)
  updatedAt: SortOrder;
}

export enum SortOrder {
  asc = "asc",
  desc = "desc",
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver()
  async author(@Root() post: Post, @Ctx() ctx: Context): Promise<User | null> {
    return ctx.prisma.post
      .findUnique({
        where: {
          id: post.id,
        },
      })
      .author()
      .then();
  }

  @Query((returns) => Post, { nullable: true })
  async postById(@Arg("id") id: string, @Ctx() ctx: Context) {
    return ctx.prisma.post.findUnique({
      where: { id },
    });
  }

  @Query((returns) => [Post])
  async feed(
    @Arg("searchString", { nullable: true }) searchString: string,
    @Arg("skip", { nullable: true }) skip: number,
    @Arg("take", { nullable: true }) take: number,
    @Arg("orderBy", { nullable: true }) orderBy: PostOrderByUpdatedAtInput,
    @Ctx() ctx: Context
  ) {
    const or = searchString
      ? {
          OR: [{ title: { contains: searchString } }, { description: { contains: searchString } }],
        }
      : {};

    return ctx.prisma.post.findMany({
      where: {
        ...or,
      },
      take: take || undefined,
      skip: skip || undefined,
      orderBy: orderBy || undefined,
    });
  }

  @Mutation((returns) => Post, { nullable: true })
  async incrementPostViewCount(@Arg("id") id: string, @Ctx() ctx: Context) {
    return ctx.prisma.post.update({
      where: { id: id || undefined },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
  }

  @Mutation((returns) => Post, { nullable: true })
  async deletePost(@Arg("id") id: string, @Ctx() ctx: Context) {
    return ctx.prisma.post.delete({
      where: {
        id,
      },
    });
  }
}
