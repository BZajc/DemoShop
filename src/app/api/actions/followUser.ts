"use server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function followUser(userToFollowId: string) {
  // Get current user session
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  const userId = session.user.id;

  try {
    // Check if user is already followed
    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: userToFollowId,
        },
      },
    });

    if (existingFollow) {
      // If followed already, remove follow
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: userToFollowId,
          },
        },
      });
      return { success: true, unfollowed: true };
    } else {
      // Follow if not followed yet
      await prisma.follows.create({
        data: {
          followerId: userId,
          followingId: userToFollowId,
        },
      });
      return { success: true, followed: true };
    }
  } catch (err) {
    return { success: false, err: "Server error" };
  }
}
