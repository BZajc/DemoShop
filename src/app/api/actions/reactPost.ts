"use server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/authOptions";


export async function reactPost(postId: string, action: "like" | "dislike") {
  // Get current user session
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  const userId = session.user.id;

  try {
    // Check existing reaction
    const existingReaction = await prisma.postReactions.findUnique({
      where: {
        userId_postId: {
          userId: userId,
          postId: postId
        }
      }
    });

    if (existingReaction) {
      // If the same reaction, remove it (toggle off)
      if (existingReaction.reaction === action) {
        await prisma.postReactions.delete({
          where: { id: existingReaction.id }
        });
      } else {
        // If different reaction, update it
        await prisma.postReactions.update({
          where: { id: existingReaction.id },
          data: { reaction: action }
        });
      }
    } else {
      // If no reaction, create new one
      await prisma.postReactions.create({
        data: {
          userId: userId,
          postId: postId,
          reaction: action
        }
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating reaction:", error);
    return { success: false, error: "Failed to update reaction" };
  }
}
