"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getAllContacts() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const userId = session.user.id;

  const contacts = await prisma.contact.findMany({
    where: {
      OR: [
        { senderId: userId, status: "accepted" },
        { receiverId: userId, status: "accepted" },
      ],
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          hashtag: true,
          avatarPhoto: true,
          lastSeenAt: true,
        },
      },
      receiver: {
        select: {
          id: true,
          name: true,
          hashtag: true,
          avatarPhoto: true,
          lastSeenAt: true,
        },
      },
    },
  });

  return contacts.map((c) => (c.senderId === userId ? c.receiver : c.sender));
}
