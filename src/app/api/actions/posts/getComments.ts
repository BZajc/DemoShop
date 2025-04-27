"use server";

import prisma from "@/lib/prisma";

interface GetCommentsOptions {
  postId: string;
  skip?: number;
  take?: number;
  sortBy?: "recent" | "random";
}

export async function getComments({ postId, skip = 0, take = 10, sortBy = "recent" }: GetCommentsOptions) {
  const orderBy =
    sortBy === "recent"
      ? [{ createdAt: "desc" as const }]
      : undefined;

  const comments = await prisma.comment.findMany({
    where: { postId },
    include: {
      user: {
        select: {
          name: true,
          avatarPhoto: true,
        },
      },
    },
    orderBy,
    skip,
    take,
  });

  return comments.map((comment) => ({
    id: comment.id,
    content: comment.content,
    userId: comment.userId,
    userName: comment.user?.name ?? null,
    userAvatar: comment.user?.avatarPhoto ?? null,
    createdAt: comment.createdAt.toISOString(),
  }));
}
