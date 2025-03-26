"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const getFollowingUsersIds = async (): Promise<string[]> => {
  const session = await auth();
  if (!session?.user?.id) return [];

  const following = await prisma.follows.findMany({
    where: {
      followerId: session.user.id,
    },
    select: {
      followingId: true,
    },
  });

  return following.map((item) => item.followingId);
};
