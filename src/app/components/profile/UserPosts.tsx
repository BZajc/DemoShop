"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface UserPostsProps {
  posts: { id: string; title: string; imageUrl: string }[];
}

export default function UserPosts({ posts }: UserPostsProps) {
  const router = useRouter();

  const openPost = (id: string) => {
    router.push(`/post/${id}`, { scroll: false });
  };

  return (
    <div className="bg-white h-1/2 max-h-[400px] w-full rounded-3xl shadow-lg p-4 overflow-y-auto custom-scrollbar">
      <h2 className="text-lg font-semibold mb-2">Published Pictures</h2>
      {posts.length > 0 ? (
        <div className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="block relative overflow-hidden rounded-lg shadow-md cursor-pointer"
              onClick={() => openPost(post.id)}
            >
              <div className="w-full max-w-[150px] aspect-square">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No posts yet.</p>
      )}
    </div>
  );
}
