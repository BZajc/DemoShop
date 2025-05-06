"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { searchEverything } from "@/app/api/actions/search/searchEverything";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";
import SearchResultsSection from "@/app/components/search/SearchResultsSection";
import SearchFilterTabs from "@/app/components/search/SearchFilterTabs";
import { SearchResult }from "@/types/SearchResult"

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query")?.trim() || "";
  const [results, setResults] = useState<SearchResult | null>(null);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "users" | "posts" | "collections"
  >("all");

  const {data: session} = useSession()

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      const res = await searchEverything(query);
      setResults(res);
    };
    fetchResults();
  }, [query]);

  if (!query) return notFound();
  if (!results) return null;

  return (
    <div className="mt-[4rem] md:mt-0 max-w-5xl mx-auto p-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-sky-900 mb-4">
        Search results for: <span className="text-sky-600">&quot;{query}&quot;</span>
      </h1>

      <SearchFilterTabs results={results} onChange={setActiveFilter} />

      <div className="space-y-12 mt-8">
        {(activeFilter === "all" || activeFilter === "users") && (
          <SearchResultsSection
            id="users"
            title="Users"
            items={results.users}
            totalCount={results.totalUsers}
            type="user"
            query={query}
          />
        )}
        {(activeFilter === "all" || activeFilter === "posts") && (
          <SearchResultsSection
            id="posts"
            title="Posts"
            items={results.posts}
            totalCount={results.totalPosts}
            type="post"
            query={query}
          />
        )}
        {(activeFilter === "all" || activeFilter === "collections") && (
          <SearchResultsSection
            id="collections"
            title="Collections"
            items={results.collections}
            totalCount={results.totalCollections}
            type="collection"
            query={query}
            sessionUserId={session?.user?.id} 
          />
        )}
      </div>
    </div>
  );
}
