"use client"
import { useState } from "react";

interface TagsAsButtonsProps {
  selectedTags: { tag: { name: string } }[];
}

const renderSortedTags = (tags: { tag: { name: string } }[], maxTags: number) => {
  if (tags.length === 0) return <span className="text-gray-500">No preferred tags</span>;

  const sortedTags = [...tags].sort((a, b) => a.tag.name.localeCompare(b.tag.name));

  return sortedTags.slice(0, maxTags).map((t) => (
    <button
      key={t.tag.name}
      className="bg-sky-200 text-sky-900 px-3 py-1 rounded-full cursor-pointer hover:bg-sky-300 transition-all"
    >
      {t.tag.name}
    </button>
  ));
};

export default function TagsAsButtons({ selectedTags }: TagsAsButtonsProps) {
  const [maxTags, setMaxTags] = useState(10);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mt-2">{renderSortedTags(selectedTags, maxTags)}</div>
      {selectedTags.length > maxTags && (
        <button
          onClick={() => setMaxTags((prev) => prev + 10)}
          className="mt-2 bg-sky-400 text-white px-4 py-2 rounded-full transition-all hover:bg-sky-600"
        >
          Show more
        </button>
      )}
    </div>
  );
}