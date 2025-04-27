'use server';

import prisma from '@/lib/prisma';

export async function removeCollectionTag(collectionId: string, tagName: string) {
  if (!collectionId || !tagName) {
    return { success: false, error: 'Invalid input' };
  }

  try {
    const tag = await prisma.tag.findUnique({
      where: { name: tagName },
    });

    if (!tag) {
      return { success: false, error: 'Tag not found' };
    }

    await prisma.collectionTag.delete({
      where: {
        collectionId_tagId: {
          collectionId,
          tagId: tag.id,
        },
      },
    });

    // Check remaining tags
    const remaining = await prisma.collectionTag.count({
      where: { collectionId },
    });

    // Reset hideTagWarning if no remaining tags
    if (remaining === 0) {
      await prisma.collection.update({
        where: { id: collectionId },
        data: { hideTagWarning: false },
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error removing collection tag:', error);
    return { success: false, error: 'Failed to remove tag' };
  }
}
