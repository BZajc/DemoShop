'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function saveCollection(originalId: string) {
  const session = await auth();
  if (!session?.user?.id) return;

  const original = await prisma.collection.findUnique({
    where: { id: originalId },
    include: { posts: true },
  });

  if (!original || original.posts.length === 0) return;

  redirect('/collections');
}
