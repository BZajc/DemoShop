'use server';

import prisma from '@/lib/prisma';

export async function getCollectionTags(collectionId: string) {
  if (!collectionId) return [];

  try {
    const tags = await prisma.collectionTag.findMany({
      where: { collectionId },
      include: {
        tag: true,
      },
    });

    return tags.map((ct) => ct.tag.name);
  } catch (error) {
    console.error('Error fetching collection tags:', error);
    return [];
  }
}
