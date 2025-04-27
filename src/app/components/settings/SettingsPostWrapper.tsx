import { auth } from "@/lib/auth";
import { getPosts } from "@/app/api/actions/posts/getPosts";
import SettingsPosts from "./SettingsPosts";
import { redirect } from "next/navigation";

export default async function SettingsPostsWrapper() {
  const session = await auth();
  if (!session?.user?.id) return redirect("/login");

  const postsRaw = await getPosts();

  const posts = postsRaw.map((p) => ({
    id: p.id,
    title: p.title,
    imageUrl: p.imageUrl,
    tags: p.tags.map((t) => t.tag.name),
    createdAt: p.createdAt.toISOString(),
    likes: p.likes,
    dislikes: p.dislikes,
    commentsCount: p.commentsCount || 0,
  }));
  
  
  return <SettingsPosts posts={posts} userId={session.user.id} />;
}