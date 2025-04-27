"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/authOptions";

export async function addPostToCollection(postId: string, collectionId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  try {
    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
      include: { posts: true },
    });

    if (!collection) return { success: false, error: "Collection not found" };
    if (collection.userId !== session.user.id) return { success: false, error: "Unauthorized" };

    // If post already exist in collection do not add it
    const alreadyAdded = collection.posts.some((post) => post.id === postId);
    if (alreadyAdded) return { success: false, error: "Post already in collection" };

    await prisma.collection.update({
      where: { id: collectionId },
      data: {
        posts: {
          connect: { id: postId },
        },
        // Set preview for collection if there isnt any
        previewImageUrl: collection.previewImageUrl ?? (
          await prisma.post.findUnique({ where: { id: postId }, select: { imageUrl: true } })
        )?.imageUrl,
      },
    });

    return { success: true };
  } catch (err) {
    console.error("Error adding post to collection:", err);
    return { success: false, error: "Server error" };
  }
}
