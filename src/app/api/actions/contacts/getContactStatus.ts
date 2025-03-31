"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ContactStatus } from "@prisma/client";

export async function getContactStatus(otherUserId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return "none";
  }

  const currentUserId = session.user.id;

  // Find relation
  const contact = await prisma.contact.findFirst({
    where: {
      OR: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId },
      ],
    },
  });

  if (!contact) {
    return "none"
  }

  if (contact.status === ContactStatus.accepted) {
    return "accepted"
  }

  if (contact.status === ContactStatus.pending) {
    return contact.senderId === currentUserId ? "invited" : "received";
  }

  return "none"
}
