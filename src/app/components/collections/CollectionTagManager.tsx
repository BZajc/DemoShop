"use client";

import { useEffect, useState } from "react";
import { tagCollection } from "@/app/api/actions/collections/tagCollection";
import { getCollectionTags } from "@/app/api/actions/collections/getCollectionTags";
import { removeCollectionTag } from "@/app/api/actions/collections/removeCollectionTag";
import { X, Loader2 } from "lucide-react";

interface Props {
  collectionId: string;
}

export default function CollectionTagManager({ collectionId }: Props) {
  const [tagInput, setTagInput] = useState("");
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      const tags = await getCollectionTags(collectionId);
      setSelectedTags(tags);
    };
    fetchTags();
  }, [collectionId]);

  useEffect(() => {
    const cleaned = tagInput.trim().replace(/^#+/, "");
    if (!cleaned) {
      setSuggestedTags([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/getTags?query=${encodeURIComponent(cleaned)}`
        );
        const data = await res.json();
        if (data.success) {
          const filtered = data.tags.filter(
            (tag: string) => !selectedTags.includes(tag)
          );
          setSuggestedTags(filtered);
        }
      } catch (err) {
        console.error("Failed to fetch tags:", err);
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [tagInput, selectedTags]);

  const handleAddTag = async (name: string) => {
    const cleaned = name.trim().replace(/^#+/, "");
    if (!cleaned || selectedTags.includes(cleaned)) return;

    setIsSubmitting(true);
    const result = await tagCollection(collectionId, [cleaned]);
    if (result.success) {
      setSelectedTags((prev) => [...prev, cleaned]);
      setTagInput("");
      setSuggestedTags([]);
    }
    setIsSubmitting(false);
  };

  const handleRemoveTag = async (tag: string) => {
    const result = await removeCollectionTag(collectionId, tag);
    if (result.success) {
      setSelectedTags((prev) => prev.filter((t) => t !== tag));
    }
  };

  return (
    <div className="mt-6">
      <label
        htmlFor="tag"
        className="block text-sm font-semibold mb-1 text-sky-900"
      >
        Tags
      </label>

      <input
        type="text"
        id="tag"
        placeholder="Add tags (e.g. #Nature)"
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        className="w-full p-2 border rounded mb-2"
      />

      {isFocused && suggestedTags.length > 0 && (
        <ul className="absolute bg-white border rounded-md shadow w-full max-h-40 overflow-y-auto z-50">
          {suggestedTags.map((tag) => (
            <li
              key={tag}
              onClick={() => handleAddTag(tag)}
              className="px-3 py-2 cursor-pointer hover:bg-sky-100 text-sky-900"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap gap-2 mt-3">
        {selectedTags.map((tag) => (
          <span
            key={tag}
            className="bg-sky-200 text-sky-900 px-3 py-1 rounded-full flex items-center gap-1 text-sm"
          >
            {tag}
            <X
              className="w-4 h-4 cursor-pointer"
              onClick={() => handleRemoveTag(tag)}
            />
          </span>
        ))}
      </div>

      {isSubmitting && (
        <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          Updating tags...
        </div>
      )}
    </div>
  );
}
