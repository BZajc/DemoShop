'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

const PAGE_SIZE = 20;

export async function getOnlineContactsPaginated(page: number = 0) {
  const session = await auth();
  if (!session?.user?.id) return [];

  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

  const contacts = await prisma.contact.findMany({
    where: {
      status: 'accepted',
      OR: [
        { senderId: session.user.id },
        { receiverId: session.user.id },
      ],
      AND: [
        {
          OR: [
            { sender: { lastSeenAt: { gte: fiveMinutesAgo } } },
            { receiver: { lastSeenAt: { gte: fiveMinutesAgo } } },
          ],
        },
      ],
    },
    skip: page * PAGE_SIZE,
    take: PAGE_SIZE,
    include: {
      sender: true,
      receiver: true,
    },
  });

  // Return unique users skipping urself
  const onlineUsers = contacts
    .map((c) =>
      c.senderId === session.user.id ? c.receiver : c.sender
    )
    .filter((user, index, self) =>
      user.id !== session.user.id &&
      self.findIndex(u => u.id === user.id) === index
    );

  return onlineUsers;
}
