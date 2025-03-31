"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ContactStatus } from "@prisma/client";

export async function cancelContactRequest(receiverId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  //   Remove invitation with pending status
  await prisma.contact.deleteMany({
    where: {
      senderId: session.user.id,
      receiverId,
      status: ContactStatus.pending,
    },
  });

  return { success: true };
}
