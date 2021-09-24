import "reflect-metadata";
import * as tq from "type-graphql";
import { PostCreateInput, PostResolver, SortOrder } from "./PostResolver";
import { ApolloServer } from "apollo-server";
import { DateTimeResolver } from "graphql-scalars";
import { context } from "./context";
import { GraphQLScalarType } from "graphql";
import { UserResolver } from "./UserResolver";

const app = async () => {
  tq.registerEnumType(SortOrder, {
    name: "SortOrder",
  });

  require("dotenv").config();

  const schema = await tq.buildSchema({
    resolvers: [PostResolver, UserResolver, PostCreateInput],
    scalarsMap: [{ type: GraphQLScalarType, scalar: DateTimeResolver }],
  });

  new ApolloServer({ schema, context: context }).listen({ port: 4000 }, () =>
    console.log(`
🚀 Server ready at: http://localhost:4000
⭐️  See sample queries: http://pris.ly/e/ts/graphql-typegraphql#using-the-graphql-api`)
  );
};

app();
