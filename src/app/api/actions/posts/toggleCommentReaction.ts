"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/authOptions";

import prisma from "@/lib/prisma";

export async function toggleCommentReaction({
  commentId,
  reaction,
}: {
  commentId: string;
  reaction: "like" | "dislike";
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Not authenticated" };

  const userId = session.user.id;

  const existing = await prisma.commentReaction.findUnique({
    where: { userId_commentId: { userId, commentId } },
  });

  // Toggle reaction if clicked the same second time
  if (existing && existing.reaction === reaction) {
    await prisma.commentReaction.delete({
      where: { userId_commentId: { userId, commentId } },
    });
    return { status: "removed" };
  }

  // Update reaction if exist and it is different than previous one
  if (existing) {
    await prisma.commentReaction.update({
      where: { userId_commentId: { userId, commentId } },
      data: { reaction },
    });
    return { status: "updated" };
  }

  // New reaction
  await prisma.commentReaction.create({
    data: {
      userId,
      commentId,
      reaction,
    },
  });

  return { status: "created" };
}
