'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User as UserIcon, Star, Loader2 } from 'lucide-react';
import { searchEverything } from '@/app/api/actions/search/searchEverything';
import type { SearchResult, SearchPost } from '@/types/SearchResult';
import type { Collection } from '@/types/Collection';

// derive the shape of a single user in search results
type SearchUser = SearchResult['users'][number];

interface Props {
  id: 'users' | 'posts' | 'collections';
  title: string;
  items: SearchUser[] | SearchPost[] | Collection[];
  totalCount: number;
  type: 'user' | 'post' | 'collection';
  query: string;
  sessionUserId?: string;
}

export default function SearchResultsSection({
  id,
  title,
  items,
  totalCount,
  type,
  query,
  sessionUserId,
}: Props) {
  // separate state slices for each category to avoid union typing
  const [userResults, setUserResults] = useState<SearchUser[]>(
    id === 'users' ? (items as SearchUser[]) : []
  );
  const [postResults, setPostResults] = useState<SearchPost[]>(
    id === 'posts' ? (items as SearchPost[]) : []
  );
  const [collectionResults, setCollectionResults] = useState<Collection[]>(
    id === 'collections' ? (items as Collection[]) : []
  );
  const [loading, setLoading] = useState(false);

  // load more items for the current category
  const loadMore = async () => {
    setLoading(true);
    const offset =
      id === 'users'
        ? userResults.length
        : id === 'posts'
        ? postResults.length
        : collectionResults.length;
    const newResults = await searchEverything(query, offset);

    if (id === 'users') {
      setUserResults([...userResults, ...(newResults.users as SearchUser[])]);
    } else if (id === 'posts') {
      setPostResults([...postResults, ...(newResults.posts as SearchPost[])]);
    } else {
      setCollectionResults([
        ...collectionResults,
        ...(newResults.collections as Collection[]),
      ]);
    }

    setLoading(false);
  };

  // pick the active results array
  const results =
    id === 'users'
      ? userResults
      : id === 'posts'
      ? postResults
      : collectionResults;

  if (results.length === 0) return null;

  return (
    <section id={id}>
      <h2 className="text-xl font-bold text-sky-900 mb-4">{title}</h2>

      {type === 'user' && (
        <div className="space-y-4">
          {userResults.map((user) => (
            <Link
              key={user.id}
              href={`/profile/${user.name}/${user.hashtag}`}
              className="group flex items-center p-4 rounded-xl shadow hover:shadow-lg transition bg-white"
            >
              {user.avatarPhoto ? (
                <Image
                  src={user.avatarPhoto}
                  alt="avatar"
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full object-cover mr-4"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  <UserIcon className="w-6 h-6 text-gray-500" />
                </div>
              )}
              <div className="text-sky-900">
                <p className="font-medium text-base">@{user.name}</p>
                {user.realName && (
                  <p className="text-sm text-gray-500">{user.realName}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {type === 'post' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {postResults.map((post) => (
            <Link
              key={post.id}
              href={`/post/${post.id}`}
              className="group relative min-h-[220px] rounded-xl overflow-hidden shadow hover:shadow-lg transition bg-white"
            >
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover blur-[2px] group-hover:blur-0 transition-all duration-300 transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all duration-300" />
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white group-hover:opacity-0 transition-opacity z-10">
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <p className="text-sm mt-1">@{post.user.name}</p>
                <div className="flex items-center mt-2 text-yellow-400 gap-1 text-sm">
                  <Star size={14} /> <span>{post.rating}%</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {type === 'collection' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {collectionResults.map((col) => (
            <Link
              key={col.id}
              href={
                col.userId === sessionUserId
                  ? `/collections/${col.id}`
                  : `/public-collection/${col.id}`
              }
              className="group relative rounded-xl overflow-hidden shadow hover:shadow-lg transition bg-white"
            >
              {col.previewImageUrl ? (
                <Image
                  src={col.previewImageUrl}
                  alt="preview"
                  width={100}
                  height={100}
                  className="w-[100px] h-[100px] object-cover rounded-l-xl"
                />
              ) : (
                <div className="w-[100px] h-[100px] bg-gray-200 flex items-center justify-center text-gray-400 rounded-l-xl">
                  No image
                </div>
              )}
              <div className="px-4 py-2 flex flex-col justify-center text-sky-900">
                <h3 className="text-lg font-semibold">{col.name}</h3>
                {col.user.realName ? (
                  <p className="text-sm text-gray-600 mt-1">
                    {col.user.realName} (@{col.user.name})
                  </p>
                ) : (
                  <p className="text-sm text-gray-600 mt-1">
                    @{col.user.name}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {col.postCount} {col.postCount === 1 ? 'photo' : 'photos'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {results.length < totalCount && (
        <div className="text-center mt-6">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-4 py-2 bg-sky-500 text-white text-sm rounded hover:bg-sky-600 transition disabled:opacity-50"
          >
            {loading ? <Loader2 /> : 'Show more'}
          </button>
        </div>
      )}
    </section>
  );
}
