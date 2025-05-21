import { createYoga } from "graphql-yoga";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { gql } from "graphql-tag";
import { GraphQLScalarType, Kind } from "graphql";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase-server";

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
    slug: String!
    description: String
    price: Float!
    imageUrl: String
    stock: Int!
    categoryId: BigInt!
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

    allProducts(
      take: Int!
      skip: Int!
      category: [String!]
      stock: Boolean
      maxPrice: Float
      minPrice: Float
      sort: String
    ): [Product!]!

    productCount(
      category: [String!]
      stock: Boolean
      minPrice: Float
      maxPrice: Float
    ): Int!

    product(id: BigInt!): Product
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
        include: { category: true },
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

    allProducts: async (
      _: unknown,
      {
        take,
        skip,
        category,
        stock,
        maxPrice,
        minPrice,
        sort,
      }: {
        take: number;
        skip: number;
        category?: string[];
        stock?: boolean;
        maxPrice?: number;
        minPrice?: number;
        sort?: "priceAsc" | "priceDesc" | "newest";
      }
    ) => {
      return prisma.product.findMany({
        where: {
          category: category?.length ? { slug: { in: category } } : undefined,
          stock:
            stock !== undefined
              ? stock
                ? { gt: 0 }
                : { equals: 0 }
              : undefined,
          price:
            minPrice || maxPrice
              ? {
                  ...(minPrice ? { gte: minPrice } : {}),
                  ...(maxPrice ? { lte: maxPrice } : {}),
                }
              : undefined,
        },
        orderBy:
          sort === "priceAsc"
            ? { price: "asc" }
            : sort === "priceDesc"
            ? { price: "desc" }
            : { createdAt: "desc" },
        take,
        skip,
        include: { category: true },
      });
    },

    productCount: async (
      _: unknown,
      {
        category,
        stock,
        minPrice,
        maxPrice,
      }: {
        category?: string[];
        stock?: boolean;
        minPrice?: number;
        maxPrice?: number;
      }
    ) => {
      const where = {
        category: category?.length ? { slug: { in: category } } : undefined,
        stock:
          stock !== undefined ? (stock ? { gt: 0 } : { equals: 0 }) : undefined,
        price:
          minPrice || maxPrice
            ? {
                ...(minPrice ? { gte: minPrice } : {}),
                ...(maxPrice ? { lte: maxPrice } : {}),
              }
            : undefined,
      };

      return prisma.product.count({ where });
    },

    product: async (_: unknown, { id }: { id: number }) => {
      return prisma.product.findUnique({
        where: { id },
        include: { category: true },
      });
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
