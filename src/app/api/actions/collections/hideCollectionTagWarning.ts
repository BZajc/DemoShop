'use server';

import prisma from '@/lib/prisma';

export async function hideCollectionTagWarning(collectionId: string) {
  try {
    await prisma.collection.update({
      where: { id: collectionId },
      data: { hideTagWarning: true },
    });

    return { success: true };
  } catch (error) {
    console.error('Error hiding tag warning:', error);
    return { success: false };
  }
}
