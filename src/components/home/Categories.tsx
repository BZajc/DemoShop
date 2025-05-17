

import Link from "next/link";
import { Tag } from "lucide-react";

const GRAPHQL_URL = `${process.env.NEXT_PUBLIC_APP_URL}/api/graphql`;

const GET_CATEGORIES = `
query GetCategories($take: Int!) {
categories(take: $take) {
id
name
slug
}
}`;

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default async function Categories() {
  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      query: GET_CATEGORIES,
      variables: {take: 4}
    })
  })

  const {data, errors} = await res.json()

  if (errors) {
    console.error("GraphQL errors:", errors)
    return <p className="text-red-500">Failed to load categories.</p>;
  }

  const categories: Category[] = data.categories

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/category/${cat.slug}`}
          className="group relative bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition"
        >
          <div className="h-24 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-zinc-800 dark:to-zinc-800 flex items-center justify-center">
            <Tag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>

          <div className="p-4 text-center">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 transition">
              {cat.name}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Explore now
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
