import { createYoga } from "graphql-yoga";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { gql } from "graphql-tag";
import { GraphQLScalarType, Kind } from "graphql";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase-server"; // ← Twój klient SSR

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
    category: Category
  }

  type Category {
    id: BigInt!
    name: String!
    slug: String!
  }

  type Profile {
    id: String!
    username: String!
    email: String!
  }

  type Query {
    featuredProducts(take: Int!): [Product!]!
    categories(take: Int!): [Category!]!
    me: Profile
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
        include: {category: true}
      }),
    categories: (_: unknown, { take }: { take: number }) =>
      prisma.category.findMany({
        take,
        orderBy: { name: "asc" },
      }),
    me: async () => {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return null;

      const profile = await prisma.profiles.findUnique({
        where: { id: user.id },
      });

      if (!profile) return null;

      return {
        id: user.id,
        email: user.email,
        username: profile.username,
      };
    },
  },
};

// Schema and Yoga handler
const schema = makeExecutableSchema({ typeDefs, resolvers });

const yoga = createYoga({
  schema,
  graphqlEndpoint: "/api/graphql",
});

export { yoga as GET, yoga as POST };
