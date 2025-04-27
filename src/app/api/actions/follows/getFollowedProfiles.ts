"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const getFollowedProfiles = async () => {
  const session = await auth();
  if (!session?.user?.id) return [];

  const follows = await prisma.follows.findMany({
    where: {
      followerId: session.user.id,
    },
    include: {
      following: {
        select: {
          id: true,
          name: true,
          realName: true,
          hashtag: true,
          avatarPhoto: true,
          lastSeenAt: true,
        },
      },
    },
  });

  return follows.map((f) => f.following);
};
