"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function sendMessage(receiverId: string, content: string) {
  const session = await auth();

  if (!session?.user?.id) return null;

  const senderId = session.user.id;

  const newMessage = await prisma.message.create({
    data: {
      senderId,
      receiverId,
      content,
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          hashtag: true,
          avatarPhoto: true,
        },
      },
    },
  });

  return newMessage;
}
