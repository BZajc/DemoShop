"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function acceptContactRequest(senderId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized." };
  }

  try {
    const existingRequest = await prisma.contact.findFirst({
      where: {
        senderId,
        receiverId: session.user.id,
        status: "pending",
      },
    });

    if (!existingRequest) {
      return {
        success: false,
        message: "Invitation expired or already accepted.",
      };
    }

    await prisma.contact.update({
      where: { id: existingRequest.id },
      data: { status: "accepted" },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to accept request." };
  }
}
