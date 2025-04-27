'use server';

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function deletePost(postId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    return { success: false, error: "Post already deleted." };
  }

  if (post.userId !== session.user.id) {
    return { success: false, error: "Not authorized to delete this post" };
  }

  await prisma.postReactions.deleteMany({ where: { postId } });
  await prisma.comment.deleteMany({ where: { postId } });

  await prisma.post.delete({ where: { id: postId } });

  revalidatePath("/feed");
  return { success: true };
}
