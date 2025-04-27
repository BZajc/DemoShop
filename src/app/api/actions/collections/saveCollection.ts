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

  const copy = await prisma.collection.create({
    data: {
      name: `${original.name} (copy)`,
      userId: session.user.id,
      previewImageUrl: original.previewImageUrl,
      posts: {
        connect: original.posts.map((post) => ({ id: post.id })),
      },
    },
  });

  redirect('/collections');
}
