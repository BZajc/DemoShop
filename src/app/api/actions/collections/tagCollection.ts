'use server';

import prisma from '@/lib/prisma';

export async function tagCollection(collectionId: string, tagNames: string[]) {
  if (!collectionId || !Array.isArray(tagNames)) {
    return { success: false, error: 'Invalid input' };
  }

  const trimmedTags = tagNames
    .map((name) => name.trim().replace(/^#+/, '')) // remove #
    .filter((name) => name.length > 0);

  if (trimmedTags.length === 0) {
    return { success: false, error: 'No valid tags provided' };
  }

  try {
    for (const name of trimmedTags) {
      const existingTag = await prisma.tag.findUnique({
        where: { name },
      });

      const tag = existingTag
        ? existingTag
        : await prisma.tag.create({ data: { name } });

      // Check if relation exist
      const alreadyTagged = await prisma.collectionTag.findUnique({
        where: {
          collectionId_tagId: {
            collectionId,
            tagId: tag.id,
          },
        },
      });

      if (!alreadyTagged) {
        await prisma.collectionTag.create({
          data: {
            collectionId,
            tagId: tag.id,
          },
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error tagging collection:', error);
    return { success: false, error: 'Failed to tag collection' };
  }
}
