import "reflect-metadata";
import { Resolver, Query, Mutation, Arg, Ctx, FieldResolver, Root, InputType, Field } from "type-graphql";
import { Post } from "./Post";
import { LoginResponse, User } from "./User";
import { Context } from "./context";
import { compare, genSalt, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";

@InputType()
class UserUniqueInput {
  @Field({ nullable: true })
  id: string;
}

@InputType()
class UserCreateInput {
  @Field({ nullable: true })
  name: string;

  @Field()
  username: string;

  @Field()
  password: string;
}

@Resolver(User)
export class UserResolver {
  @FieldResolver()
  async posts(@Root() user: User, @Ctx() ctx: Context): Promise<Post[]> {
    return ctx.prisma.user
      .findUnique({
        where: {
          id: user.id,
        },
      })
      .posts();
  }

  @Mutation((returns) => Boolean)
  async registerUser(@Arg("data") data: UserCreateInput, @Ctx() ctx: Context): Promise<boolean> {
    const salt = await genSalt(10);
    const hashedPassword = await hash(data.password, salt);

    try {
      await ctx.prisma.user.create({
        data: {
          name: data.name,
          username: data.username,
          password: hashedPassword,
        },
      });

      return true;
    } catch (err) {
      throw err;
    }
  }

  @Mutation(() => LoginResponse)
  async login(@Arg("username") username: string, @Arg("password") password: string, @Ctx() ctx: Context): Promise<LoginResponse> {
    const user = await ctx.prisma.user.findUnique({ where: { username } });

    if (!user) {
      throw new Error("could not find user");
    }

    const valid = await compare(password, user.password);

    if (!valid) {
      throw new Error("wrong password");
    }

    if (!process.env.SECRET_JWT) throw new Error("uh-oh, it seems as though something went wrong over here. check back in later!");

    // successfully logged in

    return {
      accessToken: sign({ userId: user.id }, process.env.SECRET_JWT, { expiresIn: "1h" }),
    };
  }

  @Query(() => [User])
  async allUsers(@Ctx() ctx: Context) {
    return ctx.prisma.user.findMany();
  }
}
