"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ContactStatus } from "@prisma/client";

export async function sendContactRequest(receiverId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  if (session.user.id === receiverId) {
    throw new Error("Caannot send request to yourself");
  }

  // Check if contact is already invited
  const existing = await prisma.contact.findFirst({
    where: {
      OR: [
        {
          senderId: session.user.id,
          receiverId,
        },
        {
          senderId: receiverId,
          receiverId: session.user.id,
        },
      ],
    },
  });

  if (existing) {
    throw new Error("Contact request already exists");
  }

  // Create new invitation
  await prisma.contact.create({
    data: {
      senderId: session.user.id,
      receiverId,
      status: ContactStatus.pending,
    },
  });

  return { success: true };
}
