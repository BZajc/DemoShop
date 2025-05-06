"use server";
import prisma from "@/lib/prisma";
import { Reaction } from "@/types/Post";

export async function getPosts(skip = 0, take = 10) {
  const posts = await prisma.post.findMany({
    skip,
    take,
    orderBy: {
      createdAt: "desc"
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          realName: true,
          hashtag: true,
          avatarPhoto: true
        }
      },
      tags: {
        include: {
          tag: {
            select: {
              name: true
            }
          }
        }
      },
      reactions: true,
      _count: { select: { comments: true } }
    }
  });

  return posts.map(post => {
    const likes = post.reactions.filter((r: Reaction) => r.reaction === 'like').length;
    const dislikes = post.reactions.filter((r: Reaction) => r.reaction === 'dislike').length;
    const commentsCount = post._count.comments;
    return {
      ...post,
      likes,
      dislikes,
      commentsCount,
    };
  });
}
