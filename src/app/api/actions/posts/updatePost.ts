"use server";

import prisma from "@/lib/prisma";

export async function updatePost(postId: string, title: string, tags: string[]) {
  try {
    await prisma.post.update({
      where: { id: postId },
      data: {
        tags: {
          deleteMany: {},
        },
      },
    });

    const connectTags = tags.map((tag) => ({ tag: { connect: { name: tag } } }));

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        tags: {
          create: connectTags,
        },
      },
      include: { tags: true },
    });

    return updatedPost;
  } catch (error) {
    console.error("Error during post update:", error);
    throw new Error("Couldn't update post.");
  }
}

