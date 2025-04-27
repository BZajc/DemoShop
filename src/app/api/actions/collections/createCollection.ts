"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/authOptions";

export async function createCollection(name: string, previewImageUrl?: string | null) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  try {
    const collection = await prisma.collection.create({
      data: {
        name,
        userId: session.user.id,
        previewImageUrl: previewImageUrl ?? null,
      },
    });

    return { success: true, collection };
  } catch (err) {
    console.error("Error creating collection:", err);
    return { success: false, error: "Server error" };
  }
}
