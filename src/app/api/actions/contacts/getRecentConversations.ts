"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function getRecentConversations() {
  const session = await auth();

  if (!session?.user?.id) {
    return [];
  }

  const userId = session.user.id;

  // Get 10 latest messages
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId },
        { receiverId: userId },
      ],
    },
    orderBy: {
      createdAt: "desc",
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
    take: 100,
  });

  // Map unique conversations 
  const uniqueMap = new Map<string, typeof messages[0]>();

  for (const msg of messages) {
    const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;

    if (!uniqueMap.has(otherUser.id)) {
      uniqueMap.set(otherUser.id, msg);
    }
  }

  // Return 10 latest conversations
  return Array.from(uniqueMap.values()).slice(0, 10);
}
