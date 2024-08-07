import { ApolloServer } from "apollo-server";

// import graphql schema and resolver
import { typeDefs } from "./schema/schema";
import { Query, Mutation, Post, User } from "./resolver";

// import prisma
import { Prisma, PrismaClient } from "@prisma/client";

// import utils
import { getUserFromToken } from "./utils/getUserFromToken";
import { Profile } from "./resolver";

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient<Prisma.PrismaClientOptions, never>;
  userInfo: {
    userId: number;
  } | null;
}

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
    Profile,
    Post,
    User
  },
  context: async ({ req }: any): Promise<Context> => {
    const token = req.headers.authorization;
    const userInfo = await getUserFromToken(token);
    return {
      prisma,
      userInfo,
    };
  },
});

server.listen().then(({ url }) => {
  console.log(`Server is running at ${url}`);
});
