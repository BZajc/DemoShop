"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getFollowedUsers() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const userId = session.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      following: {
        select: {
          following: {
            select: {
              id: true,
              name: true,
              hashtag: true,
              avatarPhoto: true,
              lastSeenAt: true,
            },
          },
        },
      },
    },
  });

  if (!user) return [];

  return user.following.map((f) => f.following);
}
