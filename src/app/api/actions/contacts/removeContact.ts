'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function removeContact(targetUserId: string) {
  const session = await auth();
  const myUserId = session?.user?.id;
  if (!myUserId || !targetUserId) return;

  await prisma.contact.deleteMany({
    where: {
      OR: [
        { senderId: myUserId, receiverId: targetUserId },
        { senderId: targetUserId, receiverId: myUserId },
      ],
    },
  });
}
