'use client';

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { searchEverything } from "@/app/api/actions/search/searchEverything";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

//  Helper to bold letters
function highlightMatch(text: string, query: string) {
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text;

  const before = text.slice(0, index);
  const match = text.slice(index, index + query.length);
  const after = text.slice(index + query.length);

  return (
    <>
      {before}
      <span className="font-semibold text-sky-700">{match}</span>
      {after}
    </>
  );
}

export default function SearchInput() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const { data: session } = useSession();

  useEffect(() => {
    const handler = () => setShowDropdown(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    if (query.trim() === "") {
      setResults(null);
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      const res = await searchEverything(query.trim());
      const lowercaseQuery = query.trim().toLowerCase();

      const filterMatch = (text: string | null | undefined) =>
        text?.toLowerCase().includes(lowercaseQuery);

      setResults({
        posts: res.posts.filter((p: any) => filterMatch(p.title)).slice(0, 5),
        collections: res.collections
          .filter((c: any) => filterMatch(c.name))
          .slice(0, 5),
        tags: res.tags.filter((t: any) => filterMatch(t.name)).slice(0, 5),
        users: res.users
          .filter((u: any) => filterMatch(u.name) || filterMatch(u.realName))
          .slice(0, 5),
      });

      setShowDropdown(true);
    }, 200);
  }, [query]);

  const handleSearch = () => {
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?query=${encodeURIComponent(trimmed)}`);
      setShowDropdown(false);
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className={`flex items-center rounded-full transition-all duration-300 flex-1 p-2 ${
          isFocused ? "bg-sky-200" : "bg-stone-200"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for Pictures, Collections, Authors, or Tags"
          className={`w-full outline-none px-2 ml-4 transition-all duration-300 text-sky-900 ${
            isFocused ? "bg-sky-200" : "bg-stone-200"
          }`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <button
          type="submit"
          className="ml-2 mr-4 text-sky-500 hover:text-sky-700"
        >
          <Search />
        </button>
      </form>

      {showDropdown && results && (
        <div className="absolute top-full mt-2 w-full bg-white text-sky-900 shadow-xl border rounded-xl z-50 max-h-[300px] overflow-auto text-sm p-4 space-y-3">
          {Object.entries(results).map(([key, items]) =>
            (items as any[]).length > 0 ? (
              <div key={key}>
                <h4 className="font-semibold capitalize text-sky-700 mb-1">
                  {key}
                </h4>
                <ul>
                  {(items as any[]).map((item: any) => (
                    <li key={item.id}>
                      <Link
                        href={
                          key === "users"
                            ? `/profile/${item.name}/${item.hashtag}`
                            : key === "collections"
                            ? item.userId === session?.user?.id
                              ? `/collections/${item.id}`
                              : `/public-collection/${item.id}`
                            : key === "posts"
                            ? `/post/${item.id}`
                            : `/search?query=${encodeURIComponent(item.name)}`
                        }
                        className="block px-2 py-1 hover:bg-sky-50 rounded flex items-center gap-2"
                      >
                        {key === "users" && item.avatarPhoto && (
                          <Image
                            src={item.avatarPhoto}
                            alt="avatar"
                            width={24}
                            height={24}
                            className="rounded-full object-cover w-6 h-6"
                          />
                        )}
                        {key === "posts" && item.imageUrl && (
                          <Image
                            src={item.imageUrl}
                            alt="post"
                            width={24}
                            height={24}
                            className="rounded object-cover w-6 h-6"
                          />
                        )}
                        {key === "collections" && item.previewImageUrl && (
                          <Image
                            src={item.previewImageUrl}
                            alt="collection"
                            width={24}
                            height={24}
                            className="rounded object-cover w-6 h-6"
                          />
                        )}
                        {key === "tags" && (
                          <span>{highlightMatch(item.name, query)}</span>
                        )}
                        {key === "users" && (
                          <span>
                            @{highlightMatch(item.name, query)}
                            {item.realName && (
                              <span className="ml-1 text-gray-500 text-xs">
                                ({highlightMatch(item.realName, query)})
                              </span>
                            )}
                          </span>
                        )}
                        {key === "posts" && (
                          <span>{highlightMatch(item.title, query)}</span>
                        )}
                        {key === "collections" && (
                          <span>{highlightMatch(item.name, query)}</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
