'use server'

import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth'

export async function removePostFromCollection(postId: string, collectionId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check owner of the collection
    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
      select: { userId: true }
    })

    if (!collection || collection.userId !== session.user.id) {
      return { success: false, error: 'Access denied' }
    }

    // Remove post from collection
    await prisma.collection.update({
      where: { id: collectionId },
      data: {
        posts: {
          disconnect: { id: postId }
        }
      }
    })

    return { success: true }
  } catch (error) {
    console.error('removePostFromCollection error:', error)
    return { success: false, error: 'Something went wrong' }
  }
}
