"use server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/authOptions";

import { uploadPostImage } from "@/lib/cloudinary";

export async function createPost(data: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  const userId = session.user.id;
  const title = data.get("title") as string;
  const tags = JSON.parse(data.get("tags") as string) as string[];
  const image = data.get("image") as File | null;

  let imageUrl = "";
  if (image && image.size > 0) {
    imageUrl = await uploadPostImage(image);
  }

  try {
    const existingTags = await prisma.tag.findMany({
      where: { name: { in: tags } },
      select: { id: true, name: true },
    });

    const newPost = await prisma.post.create({
      data: {
        title,
        imageUrl,
        userId,
      },
    });

    await prisma.postTag.createMany({
      data: existingTags.map((tag: { id: string; name: string }) => ({
        postId: newPost.id,
        tagId: tag.id,
      })),
    });

    return { success: true, post: newPost };
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to create post";
    console.error("Error creating post:", errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}
