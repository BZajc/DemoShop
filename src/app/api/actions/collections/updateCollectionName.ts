'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function updateCollectionName(
    collectionId: string,
    newName: string
  ): Promise<{ success: true } | undefined> {
    const session = await auth();
    if (!session?.user?.id || !newName.trim()) return;
  
    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
      select: { userId: true },
    });
  
    if (!collection || collection.userId !== session.user.id) return;
  
    await prisma.collection.update({
      where: { id: collectionId },
      data: { name: newName.trim() },
    });
  
    return { success: true };
  }
  