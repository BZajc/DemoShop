"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PostOptionsMenu from "../post/PostOptionsMenu";
import EditPostModal from "../post/EditPostModal";
import DeleteConfirmationModal from "../post/DeleteConfirmationModal";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface Props {
  posts: any[];
  userId: string;
}

export default function SettingsPosts({ posts, userId }: Props) {
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [editPostId, setEditPostId] = useState<string | null>(null);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    setDeletePostId(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-2xl font-bold text-sky-900 mb-4">Your Posts</h2>

        {posts.length === 0 && (
          <p className="text-gray-600">You haven't published any posts yet.</p>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {posts.map((post) => {
            const likes = post.likes || 0;
            const dislikes = post.dislikes || 0;

            return (
              <div
                key={post.id}
                className="relative bg-white shadow rounded overflow-visible transform transition-transform duration-300 hover:scale-[1.05]"
              >
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  width={800}
                  height={500}
                  className="w-full h-56 object-cover cursor-pointer rounded-t"
                  onClick={() =>
                    setSelectedPost({ ...post, likes, dislikes })
                  }
                />

                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-sky-900">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {post.tags?.map((tag: any) => (
                          <span
                            key={tag.tag?.name || tag}
                            className="text-xs bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full"
                          >
                            {tag.tag?.name || tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-700">
                        <div className="flex items-center gap-1">
                          <ThumbsUp size={16} className="text-sky-600" />
                          <span className="font-medium">{likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsDown size={16} className="text-red-500" />
                          <span className="font-medium">{dislikes}</span>
                        </div>
                        <div className="text-xs text-gray-500 ml-1">
                          {Math.round(
                            (likes / (likes + dislikes || 1)) * 100
                          )}
                          %
                        </div>
                      </div>

                      <Link
                        href={`/post/${post.id}`}
                        className="inline-block mt-3 px-3 py-1 text-sm bg-sky-500 text-white rounded-full hover:bg-sky-600 transition"
                      >
                        Check Post
                      </Link>
                    </div>

                    <PostOptionsMenu
                      postId={post.id}
                      authorId={userId}
                      postTitle={post.title}
                      currentTags={
                        post.tags?.map((t: any) => t.tag?.name || t) || []
                      }
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedPost && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex justify-center items-center"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh] bg-white rounded shadow p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedPost.imageUrl}
              alt={selectedPost.title}
              width={1000}
              height={1000}
              className="max-w-full max-h-[70vh] object-contain rounded"
            />

            <div className="mt-4 text-center space-y-2">
              <h3 className="text-xl font-semibold text-sky-900">
                {selectedPost.title}
              </h3>

              <div className="flex justify-center items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <ThumbsUp size={16} className="text-sky-600" />
                  <span className="font-medium">{selectedPost.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsDown size={16} className="text-red-500" />
                  <span className="font-medium">{selectedPost.dislikes}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {Math.round(
                    (selectedPost.likes /
                      (selectedPost.likes + selectedPost.dislikes || 1)) * 100
                  )}
                  %
                </div>
              </div>

              <Link
                href={`/post/${selectedPost.id}`}
                className="inline-block mt-3 px-4 py-2 text-sm bg-sky-600 text-white rounded hover:bg-sky-700 transition"
              >
                Check Post
              </Link>
            </div>
          </div>
        </div>
      )}

      {editPostId && (() => {
        const post = posts.find((p) => p.id === editPostId);
        if (!post) return null;
        return (
          <EditPostModal
            postId={post.id}
            currentTitle={post.title}
            currentTags={
              post.tags?.map((t: any) => t.tag?.name || t) || []
            }
            onClose={() => setEditPostId(null)}
          />
        );
      })()}

      {deletePostId && (
        <DeleteConfirmationModal
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletePostId(null)}
        />
      )}
    </div>
  );
}
