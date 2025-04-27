"use client";

import { useEffect, useState } from "react";
import { updatePost } from "@/app/api/actions/posts/updatePost";
import { X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface EditPostModalProps {
  postId: string;
  currentTitle: string;
  currentTags: string[];
  onClose: () => void;
}

export default function EditPostModal({
  postId,
  currentTitle,
  currentTags,
  onClose,
}: EditPostModalProps) {
  const [title, setTitle] = useState(currentTitle || "");
  const [tagInput, setTagInput] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(currentTags || []);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updated, setUpdated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const cleanedInput = tagInput.trim().replace(/^#+/, "");
    if (!cleanedInput) {
      setSuggestedTags([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/getTags?query=${encodeURIComponent(cleanedInput)}`
        );
        const data = await res.json();
        if (data.success) {
          const filtered = data.tags.filter(
            (tag: string) => !selectedTags.includes(tag)
          );
          setSuggestedTags(filtered);
        }
      } catch (err) {
        console.error("Error fetching tags:", err);
      }
    }, 200);

    return () => clearTimeout(delay);
  }, [tagInput, selectedTags]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (title.trim() === "" || selectedTags.length === 0) return;

    setIsSubmitting(true);
    try {
      await updatePost(postId, title.trim(), selectedTags);
      setUpdated(true);

      setTimeout(() => {
        setUpdated(false);
        onClose();
        router.push(`/post/${postId}`);
      }, 2000);
    } catch (err) {
      console.error("Failed to update post:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000]"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-xl shadow-lg w-[500px] max-w-full relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-black">Edit Post</h2>
        <form onSubmit={handleSubmit} className="text-black relative">
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border rounded mb-4"
          />

          <label htmlFor="tags" className="block text-sm font-medium mb-1">
            Tags
          </label>
          <input
            id="tags"
            type="text"
            placeholder="Add tags (e.g. #Sky)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            className="w-full p-2 border rounded mb-4"
          />

          {isFocused && suggestedTags.length > 0 && (
            <ul className="absolute bg-white border rounded-md w-full z-50 max-h-40 overflow-y-auto shadow">
              {suggestedTags.map((tag) => (
                <li
                  key={tag}
                  onClick={() => {
                    setSelectedTags([...selectedTags, tag]);
                    setTagInput("");
                    setSuggestedTags([]);
                  }}
                  className="p-2 hover:bg-sky-100 text-sky-700 cursor-pointer"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-wrap gap-2 mt-2 mb-6">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                onClick={() =>
                  setSelectedTags(selectedTags.filter((t) => t !== tag))
                }
                className="bg-sky-200 text-sky-900 px-3 py-1 rounded-full cursor-pointer hover:bg-sky-300 flex items-center"
              >
                {tag} <X className="ml-2 w-4 h-4" />
              </span>
            ))}
          </div>

          {updated ? (
            <div className="w-full text-center text-green-600 font-medium py-2">
              Post updated
            </div>
          ) : (
            <button
              type="submit"
              disabled={
                isSubmitting || title.trim() === "" || selectedTags.length === 0
              }
              className={`w-full p-2 rounded font-semibold transition ${
                isSubmitting || title.trim() === "" || selectedTags.length === 0
                  ? "bg-sky-500 text-white opacity-50 cursor-not-allowed"
                  : "bg-sky-500 text-white hover:bg-sky-600"
              }`}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin mx-auto" size={24} />
              ) : (
                "Save Changes"
              )}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
