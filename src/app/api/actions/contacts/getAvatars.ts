'use server';

import prisma from '@/lib/prisma';

export async function getAvatars(userIds: string[]) {
  const users = await prisma.user.findMany({
    where: {
      id: { in: userIds },
    },
    select: {
      id: true,
      avatarPhoto: true,
    },
  });

  return users;
}
