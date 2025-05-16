import { createYoga } from "graphql-yoga";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { gql } from "graphql-tag";
import { GraphQLScalarType, Kind } from "graphql";
import { prisma } from "@/lib/prisma";

// Scalar to fix "GraphQLError: ID cannot represent value" error
const BigIntScalar = new GraphQLScalarType({
  name: "BigInt",
  description: "BigInt custom scalar type, serialized as string",
  serialize(value: unknown): string {
    if (typeof value === "bigint") return value.toString();
    if (typeof value === "number") return value.toString();
    if (typeof value === "string") return value;
    throw new TypeError(`BigInt cannot represent value: ${value}`);
  },
  parseValue(value: unknown): bigint {
    if (typeof value === "string" || typeof value === "number") {
      return BigInt(value);
    }
    throw new TypeError(`BigInt cannot represent non-numeric value: ${value}`);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT || ast.kind === Kind.STRING) {
      return BigInt(ast.value);
    }
    return null;
  },
});

// Type Defs
const typeDefs = gql`
  scalar BigInt

  type Product {
    id: BigInt!
    name: String!
    price: Float!
    imageUrl: String
    description: String
  }

  type Category {
    id: BigInt!
    name: String!
    slug: String!
  }

  type Query {
    featuredProducts(take: Int!): [Product!]!
    categories(take: Int!): [Category!]!
  }
`;

// Resolvers
const resolvers = {
  BigInt: BigIntScalar,
  Query: {
    featuredProducts: (_: unknown, { take }: { take: number }) =>
      prisma.product.findMany({
        take,
        orderBy: { createdAt: "desc" },
      }),
    categories: (_: unknown, { take }: { take: number }) =>
      prisma.category.findMany({
        take,
        orderBy: { name: "asc" },
      }),
  },
};

// Schema and Yoga handler
const schema = makeExecutableSchema({ typeDefs, resolvers });

const yoga = createYoga({
  schema,
  graphqlEndpoint: "/api/graphql",
});

export { yoga as GET, yoga as POST };
