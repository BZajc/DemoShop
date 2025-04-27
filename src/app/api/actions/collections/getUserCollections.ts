"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function getUserCollections() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const collections = await prisma.collection.findMany({
    where: { userId: session.user.id },
    include: {
      posts: {
        select: {
          id: true,
          imageUrl: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return collections.map((collection) => {
    const customPreview = collection.previewImageUrl;
    const lastPostWithImage = collection.posts.find((p) => p.imageUrl);

    return {
      id: collection.id,
      name: collection.name,
      previewImage: customPreview?.startsWith("http")
        ? customPreview
        : lastPostWithImage?.imageUrl?.startsWith("http")
        ? lastPostWithImage.imageUrl
        : null,
      postCount: collection.posts.length,
      hideTagWarning: collection.hideTagWarning,
    };
  });
}
