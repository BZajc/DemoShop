import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import SettingsPosts from "./SettingsPosts";
import { redirect } from "next/navigation";

export default async function SettingsPostsWrapper() {
  const session = await auth();

  if (!session?.user?.id) {
    return redirect("/login");
  }

  // get only logged user's posts
  const userWithPosts = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      posts: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          imageUrl: true,
          createdAt: true,
          reactions: true,            
          tags: {                     
            include: { tag: { select: { name: true } } },
          },
          _count: { select: { comments: true } },
        },
      },
    },
  });

  if (!userWithPosts) {
    return redirect("/login");
  }

  const posts = userWithPosts.posts.map((p) => {
    const likes = p.reactions.filter((r) => r.reaction === "like").length;
    const dislikes = p.reactions.filter((r) => r.reaction === "dislike").length;
    const commentsCount = p._count.comments;

    return {
      id:            p.id,
      title:         p.title,
      imageUrl:      p.imageUrl,
      tags:          p.tags.map((t) => t.tag.name),
      createdAt:     p.createdAt.toISOString(),
      likes,
      dislikes,
      commentsCount,
    };
  });

  return <SettingsPosts posts={posts} userId={session.user.id} />;
}
