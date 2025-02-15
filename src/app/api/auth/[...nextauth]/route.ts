import NextAuth, { AuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
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
          hashtag: user.hashtag ?? undefined
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

        // Ensure unique combination of `name + hashtag`
        while (!isUnique) {
          const checkUser = await prisma.user.findUnique({
            where: {
              name_hashtag: {
                name,
                hashtag,
              },
            },
          });

          if (!checkUser) {
            isUnique = true;
          } else {
            hashtag = generateHashtag(); // If not unique, generate a new hashtag
          }
        }

        // Create a new user with a unique hashtag
        existingUser = await prisma.user.create({
          data: {
            name,
            email,
            hashtag,
            avatarPhoto: user.image ?? null,
          },
        });
      } else if (!existingUser.hashtag) {
        // If the user exists but has no hashtag generate one
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

          if (!checkUser) {
            isUnique = true;
          } else {
            hashtag = generateHashtag();
          }
        }

        await prisma.user.update({
          where: { id: existingUser.id },
          data: { hashtag },
        });
      }

      return true;
    },

    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
          // Fetch hashtag from database if user exists
          const dbUser = await prisma.user.findUnique({
              where: { email: user.email },
              select: { hashtag: true }, 
          });

          token.sub = user.id;
          token.hashtag = dbUser?.hashtag || "";
      }
      return token;
  },

  async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
          session.user.id = token.sub;
          session.user.hashtag = token.hashtag || "";
      }
      return session;
  },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
