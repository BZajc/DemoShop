"use client";

export default function SortSelect() {
  return (
    <select
      className="px-3 py-2 border border-brown-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-sm text-brown-700 dark:text-white cursor-pointer focus:ring-2 focus:ring-brown-500"
      defaultValue="newest"
    >
      <option value="newest">Newest</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
    </select>
  );
}
