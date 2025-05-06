'use server';

import prisma from '@/lib/prisma';

export async function searchEverything(query: string, offset: number = 0) {
  const trimmed = query.trim();

  if (!trimmed) {
    return {
      posts: [],
      collections: [],
      users: [],
      tags: [],
      totalPosts: 0,
      totalCollections: 0,
      totalUsers: 0,
    };
  }

  const [postsRaw, collectionsRaw, usersRaw, tags, totalCounts] = await Promise.all([
    prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: trimmed } },
          { tags: { some: { tag: { name: { contains: trimmed } } } } },
          { user: { name: { contains: trimmed } } },
        ],
      },
      include: {
        user: { select: { name: true, hashtag: true } },
        reactions: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: 10,
    }),

    prisma.collection.findMany({
      where: {
        OR: [
          { name: { contains: trimmed } },
          { collectionTags: { some: { tag: { name: { contains: trimmed } } } } },
          { user: { name: { contains: trimmed } } },
        ],
      },
      include: {
        posts: { select: { id: true, imageUrl: true } },
        user: { select: { name: true, realName: true, hashtag: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: 10,
    }),
    

    prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: trimmed } },
          { realName: { contains: trimmed } },
          { selectedTags: { some: { tag: { name: { contains: trimmed } } } } },
        ],
      },
      select: {
        id: true,
        name: true,
        realName: true,
        avatarPhoto: true,
        hashtag: true,
        selectedTags: {
          include: { tag: true },
        },
      },
      skip: offset,
      take: 10,
    }),

    prisma.tag.findMany({
      where: {
        name: { contains: trimmed },
      },
      take: 10,
    }),

    Promise.all([
      prisma.post.count({
        where: {
          OR: [
            { title: { contains: trimmed } },
            { tags: { some: { tag: { name: { contains: trimmed } } } } },
            { user: { name: { contains: trimmed } } },
          ],
        },
      }),
      prisma.collection.count({
        where: {
          OR: [
            { name: { contains: trimmed } },
            { collectionTags: { some: { tag: { name: { contains: trimmed } } } } },
            { user: { name: { contains: trimmed } } },
          ],
        },
      }),
      prisma.user.count({
        where: {
          OR: [
            { name: { contains: trimmed } },
            { realName: { contains: trimmed } },
            { selectedTags: { some: { tag: { name: { contains: trimmed } } } } },
          ],
        },
      }),
    ]),
  ]);

  const posts = postsRaw.map((post) => {
    const likes = post.reactions.filter((r) => r.reaction === 'like').length;
    const dislikes = post.reactions.filter((r) => r.reaction === 'dislike').length;    
    const total = likes + dislikes;
    const rating = total > 0 ? Math.round((likes / total) * 100) : 0;

    return {
      id: post.id,
      title: post.title,
      imageUrl: post.imageUrl,
      user: post.user,
      rating,
    };
  });

  const collections = collectionsRaw
    .filter((c) => c.posts.length > 0)
    .map((c) => ({
      id: c.id,
      name: c.name,
      previewImageUrl: c.posts[0]?.imageUrl || null,
      user: c.user,
      postCount: c.posts.length,
      userId: c.userId,
    }));

  return {
    posts,
    collections,
    users: usersRaw,
    tags,
    totalPosts: totalCounts[0],
    totalCollections: totalCounts[1],
    totalUsers: totalCounts[2],
  };
}
