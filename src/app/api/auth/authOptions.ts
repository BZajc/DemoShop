import { AuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"
import { generateHashtag } from "@/lib/utils";

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: credentials.email }, { name: credentials.email }],
          },
        });

        if (!user) {
          throw new Error("User not found");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password || ""
        );
        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          hashtag: user.hashtag ?? undefined,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      const name: string = user.name ?? "UnknownUser";
      const email: string = user.email ?? "";
      let existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (!existingUser) {
        let hashtag: string = generateHashtag();
        let isUnique = false;

        while (!isUnique) {
          const checkUser = await prisma.user.findUnique({
            where: {
              name_hashtag: { name, hashtag },
            },
          });

          if (!checkUser) isUnique = true;
          else hashtag = generateHashtag();
        }

        existingUser = await prisma.user.create({
          data: {
            name,
            email,
            hashtag,
            avatarPhoto: user.image ?? null,
          },
        });
      } else if (!existingUser.hashtag) {
        let hashtag: string = generateHashtag();
        let isUnique = false;

        while (!isUnique) {
          const checkUser = await prisma.user.findUnique({
            where: {
              name_hashtag: {
                name: existingUser.name,
                hashtag,
              },
            },
          });

          if (!checkUser) isUnique = true;
          else hashtag = generateHashtag();
        }

        await prisma.user.update({
          where: { id: existingUser.id },
          data: { hashtag },
        });
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { id: true, hashtag: true },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.hashtag = dbUser.hashtag || "";
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = typeof token.id === "string" ? token.id : "";
      session.user.hashtag =
        typeof token.hashtag === "string" ? token.hashtag : "";
      return session;
    },
  },
};
