'use client';

import { useState } from 'react';
import CollectionPostModal from './CollectionPostModal';
import Link from 'next/link';
import Image from 'next/image';
import { Edit, Check, X } from 'lucide-react';
import { updateCollectionName } from '@/app/api/actions/collections/updateCollectionName';

interface CollectionClientProps {
  collectionId: string;
  collectionName: string;
  initialPosts: {
    id: string;
    title: string | null;
    imageUrl: string;
    user: {
      name: string;
      hashtag: string | null;
    };
  }[];
}

export default function CollectionClient({
  collectionId,
  collectionName,
  initialPosts,
}: CollectionClientProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [removedPosts, setRemovedPosts] = useState<typeof posts>([]);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(collectionName);
  const [currentName, setCurrentName] = useState(collectionName);

  const handlePostRemoved = (postId: string) => {
    const removed = posts.find((p) => p.id === postId);
    if (!removed) return;
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    setRemovedPosts((prev) => [...prev, removed]);
  };

  const handleUndo = (postId: string) => {
    const undoPost = removedPosts.find((p) => p.id === postId);
    if (!undoPost) return;
    setPosts((prev) => [undoPost, ...prev]);
    setRemovedPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handleRename = async () => {
    const trimmed = newName.trim();
    if (!trimmed || trimmed === currentName) {
      setEditing(false);
      return;
    }

    const result = await updateCollectionName(collectionId, trimmed);
    if (result?.success) {
      setCurrentName(trimmed);
    }
    setEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        {editing ? (
          <>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="text-2xl font-bold text-sky-900 border px-2 py-1 rounded w-full max-w-[300px]"
            />
            <button onClick={handleRename} className="text-green-600 hover:text-green-800">
              <Check size={20} />
            </button>
            <button
              onClick={() => {
                setNewName(currentName);
                setEditing(false);
              }}
              className="text-red-500 hover:text-red-700"
            >
              <X size={20} />
            </button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-sky-900">{currentName}</h1>
            <button onClick={() => setEditing(true)} className="text-sky-500 hover:text-sky-700">
              <Edit size={20} />
            </button>
          </>
        )}
      </div>

      {posts.length === 0 && removedPosts.length === 0 ? (
        <p className="text-gray-500">This collection is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...posts, ...removedPosts].map((post) =>
            posts.find((p) => p.id === post.id) ? (
              <div
                key={post.id}
                className="border rounded-xl shadow hover:shadow-lg transition bg-white"
              >
                <CollectionPostModal
                  postId={post.id}
                  imageUrl={post.imageUrl}
                  title={post.title || 'Untitled'}
                  collectionId={collectionId}
                  onPostRemoved={handlePostRemoved}
                />
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-sm text-sky-900 font-semibold">
                      {post.title || 'Untitled'}
                    </h3>
                    <Link
                      href={`/profile/${post.user.name}/${post.user.hashtag}`}
                      className="text-xs text-gray-600 hover:underline"
                    >
                      @{post.user.name}
                    </Link>
                  </div>
                  <Link
                    href={`/post/${post.id}`}
                    className="text-sm text-sky-500 hover:bg-sky-100 hover:text-sky-700 px-4 py-2 rounded-full border border-sky-500 hover:border-sky-700 transition duration-300"
                  >
                    Go to post
                  </Link>
                </div>
              </div>
            ) : (
              <div
                key={post.id}
                className="relative border rounded-xl shadow bg-gray-100 h-72 overflow-hidden group"
              >
                <Image
                  src={post.imageUrl}
                  alt="Removed post preview"
                  fill
                  className="object-cover opacity-40 blur-sm group-hover:scale-105 transition"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-sky-900 text-center px-4 z-10">
                  <p className="mb-2 font-semibold">Post removed from collection</p>
                  <button
                    onClick={() => handleUndo(post.id)}
                    className="px-4 py-2 text-sm rounded bg-sky-500 text-white hover:bg-sky-600 transition"
                  >
                    Undo
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
