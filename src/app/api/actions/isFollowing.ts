"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function isFollowing(userId: string): Promise<boolean> {
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  if (!currentUserId || currentUserId === userId) return false;

  const follow = await prisma.follows.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentUserId,
        followingId: userId,
      },
    },
  });

  return !!follow;
}
