"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Star, Loader2 } from "lucide-react";
import { searchEverything } from "@/app/api/actions/search/searchEverything";

interface Props {
  id: "users" | "posts" | "collections";
  title: string;
  items: any[];
  totalCount: number;
  type: "user" | "post" | "collection";
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
  const [results, setResults] = useState(items);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    setLoading(true);
    const newResults = await searchEverything(query, results.length);
    setResults((prev) => [...prev, ...newResults[id]]);
    setLoading(false);
  };

  if (results.length === 0) return null;

  return (
    <section id={id}>
      <h2 className="text-xl font-bold text-sky-900 mb-4">{title}</h2>

      <div
        className={
          type === "user"
            ? "space-y-4"
            : "grid grid-cols-1 md:grid-cols-2 gap-4"
        }
      >
        {results.map((item) => (
          <Link
            key={item.id}
            href={
              type === "collection"
                ? item.userId === sessionUserId
                  ? `/collections/${item.id}`
                  : `/public-collection/${item.id}`
                : type === "user"
                ? `/profile/${item.name}/${item.hashtag}`
                : `/post/${item.id}`
            }
            className={`group rounded-xl overflow-hidden shadow hover:shadow-lg transition bg-white ${
                type === "user"
                  ? "flex items-center p-4"
                  : type === "post"
                  ? "relative min-h-[220px]"
                  : "relative"
              }`}
              
          >
            {/* POST BACKGROUND + OVERLAY */}
            {type === "post" && item.imageUrl && (
              <>
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover blur-[2px] group-hover:blur-0 transition-all duration-300 transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all duration-300" />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white group-hover:opacity-0 transition-opacity z-10">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm mt-1">@{item.user.name}</p>
                  <div className="flex items-center mt-2 text-yellow-400 gap-1 text-sm">
                    <Star size={14} />
                    <span>{item.rating}%</span>
                  </div>
                </div>
              </>
            )}

            {/* USER */}
            {type === "user" && (
              <>
                {item.avatarPhoto ? (
                  <Image
                    src={item.avatarPhoto}
                    alt="avatar"
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-full object-cover mr-4"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                    <User className="w-6 h-6 text-gray-500" />
                  </div>
                )}
                <div className="text-sky-900">
                  <p className="font-medium text-base">@{item.name}</p>
                  {item.realName && (
                    <p className="text-sm text-gray-500">{item.realName}</p>
                  )}
                </div>
              </>
            )}

            {/* COLLECTION */}
            {type === "collection" && (
              <div className="flex h-[100px] min-h-[100px]">
                {item.previewImageUrl ? (
                  <Image
                    src={item.previewImageUrl}
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
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.user?.realName
                      ? `${item.user.realName} (@${item.user.name})`
                      : `@${item.user.name}`}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.postCount} {item.postCount === 1 ? "photo" : "photos"}
                  </p>
                </div>
              </div>
            )}
          </Link>
        ))}
      </div>

      {results.length < totalCount && (
        <div className="text-center mt-6">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-4 py-2 bg-sky-500 text-white text-sm rounded hover:bg-sky-600 transition disabled:opacity-50"
          >
            {loading ? <Loader2 /> : "Show more"}
          </button>
        </div>
      )}
    </section>
  );
}
