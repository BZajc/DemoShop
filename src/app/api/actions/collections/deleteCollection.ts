"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function deleteCollection(
  collectionId: string
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const collection = await prisma.collection.findUnique({
    where: { id: collectionId },
    select: { userId: true },
  });

  if (!collection || collection.userId !== session.user.id) {
    return { success: false, error: "Access denied" };
  }

  await prisma.collection.delete({
    where: { id: collectionId },
  });

  return { success: true };
}
