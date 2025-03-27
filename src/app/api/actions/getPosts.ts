"use server";
import prisma from "@/lib/prisma";

export async function getPosts() {
  const posts = await prisma.post.findMany({
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
      reactions: true
    }
  });

  // Calculate likes and dislikes for each post
  const formattedPosts = posts.map(post => {
    const likes = post.reactions.filter((r: { reaction: string }) => r.reaction === 'like').length;
    const dislikes = post.reactions.filter((r: { reaction: string }) => r.reaction === 'dislike').length;

    return {
      ...post,
      likes,
      dislikes
    }
  });

  return formattedPosts;
}
