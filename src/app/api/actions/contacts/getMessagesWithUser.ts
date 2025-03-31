"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface Options {
  contactUserId: string;
  page?: number;
  pageSize?: number;
}

export async function getMessagesWithUser({ contactUserId, page = 1, pageSize = 10 }: Options) {
  const session = await auth();

  if (!session?.user?.id) {
    return [];
  }

  const userId = session.user.id;

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, receiverId: contactUserId },
        { senderId: contactUserId, receiverId: userId },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
    take: pageSize,
    skip: (page - 1) * pageSize,
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

  return messages;
}
