"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface CreateCommentPayload {
  postId: string;
  content: string;
}

export async function createComment({ postId, content}: CreateCommentPayload) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await prisma.comment.create({
    data: {
      postId,
      content,
      userId: session.user.id,
    },
  });
}
