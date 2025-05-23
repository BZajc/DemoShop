import { createYoga } from "graphql-yoga";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { gql } from "graphql-tag";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase-server";
import { Prisma } from "@prisma/client";

type FullProduct = Prisma.ProductGetPayload<{
  include: {
    productOptions: true;
    productImages: true;
    productSpecifications: true;
    productGuarantees: true;
    productFaqs: true;
    category: true;
  };
}>;

const typeDefs = gql`
  type Product {
    id: Int!
    name: String!
    slug: String!
    description: String
    price: Float!
    displayImage: String
    stock: Int!
    category: Category
    options: [Option!]!
    images: [Image!]!
    specifications: [Specification!]!
    guarantee: [Guarantee!]!
    faqs: [FAQ!]!
  }

  type Option {
    optionKey: String!
    optionValue: String!
  }

  type Category {
    id: Int!
    name: String!
    slug: String!
  }

  type Image {
    url: String!
    displayOrder: Int
  }

  type Specification {
    label: String!
    value: String!
  }

  type Guarantee {
    type: String!
    count: Int!
    unit: String!
  }

  type FAQ {
    question: String!
    answer: String!
    sortOrder: Int!
  }

  type Profile {
    id: ID!
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
    product(id: Int!): Product
  }
`;

const resolvers = {
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

    allProducts: (_: unknown, args: any) =>
      prisma.product.findMany({
        where: {
          category: args.category?.length
            ? { slug: { in: args.category } }
            : undefined,
          stock:
            args.stock !== undefined
              ? args.stock
                ? { gt: 0 }
                : { equals: 0 }
              : undefined,
          price:
            args.minPrice || args.maxPrice
              ? {
                  ...(args.minPrice ? { gte: args.minPrice } : {}),
                  ...(args.maxPrice ? { lte: args.maxPrice } : {}),
                }
              : undefined,
        },
        orderBy:
          args.sort === "priceAsc"
            ? { price: "asc" }
            : args.sort === "priceDesc"
            ? { price: "desc" }
            : { createdAt: "desc" },
        take: args.take,
        skip: args.skip,
        include: { category: true },
      }),

    productCount: (_: unknown, args: any) =>
      prisma.product.count({
        where: {
          category: args.category?.length
            ? { slug: { in: args.category } }
            : undefined,
          stock:
            args.stock !== undefined
              ? args.stock
                ? { gt: 0 }
                : { equals: 0 }
              : undefined,
          price:
            args.minPrice || args.maxPrice
              ? {
                  ...(args.minPrice ? { gte: args.minPrice } : {}),
                  ...(args.maxPrice ? { lte: args.maxPrice } : {}),
                }
              : undefined,
        },
      }),

    product: (_: unknown, { id }: { id: number }) =>
      prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          productOptions: {
            select: { optionKey: true, optionValue: true },
          },
          productImages: {
            orderBy: { displayOrder: "asc" },
            select: { url: true, displayOrder: true },
          },
          productSpecifications: {
            select: { label: true, value: true },
          },
          productGuarantees: {
            select: { type: true, count: true, unit: true },
          },
          productFaqs: {
            orderBy: { sortOrder: "asc" },
            select: { question: true, answer: true, sortOrder: true },
          },
        },
      }),
  },
  Product: {
    options: (parent: FullProduct) => parent.productOptions,
    images: (parent: FullProduct) => parent.productImages,
    specifications: (parent: FullProduct) => parent.productSpecifications,
    guarantee: (parent: FullProduct) => parent.productGuarantees,
    faqs: (parent: FullProduct) => parent.productFaqs,
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });
const yoga = createYoga({ schema, graphqlEndpoint: "/api/graphql" });

export { yoga as GET, yoga as POST };
