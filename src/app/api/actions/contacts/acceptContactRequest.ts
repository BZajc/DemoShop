"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ContactStatus } from "@prisma/client";

export async function acceptContactRequest(senderId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  //   Find invitation that has been received
  const existing = await prisma.contact.findFirst({
    where: {
      senderId,
      receiverId: session.user.id,
      status: ContactStatus.pending,
    },
  });

  if (!existing) {
    throw new Error("No pending request found");
  }

  // Update status from "pending" to "accepted"
  await prisma.contact.update({
    where: {
      id: existing.id,
    },
    data: {
      status: ContactStatus.accepted,
    },
  });

  return { success: true };
}
