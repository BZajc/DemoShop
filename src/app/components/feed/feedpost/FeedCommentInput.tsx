"use client";
import { useState, useRef, useEffect } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { MessageCircle, Smile } from "lucide-react";
import { createComment } from "@/app/api/actions/createComment";
import { useRouter } from "next/navigation";

export default function FeedCommentInput({ postId }: { postId: string }) {
  const router = useRouter();
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [input, setInput] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const maxChars = 400;

  // Close picker if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };
    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);

  const handleEmojiSelect = (emoji: EmojiClickData) => {
    const newValue = input + emoji.emoji;
    if (newValue.length <= maxChars) {
      setInput(newValue);
    }
  };

  // Handles comment form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setSuccess(false);
    try {
      await createComment({ postId, content: input });
      router.refresh();
      setSuccess(true);
      setInput("");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to post comment", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex p-2 m-2 rounded-full transition-all duration-300 ${
        isFocused ? "bg-white" : "bg-stone-200"
      }`}
    >
      <input
        type="text"
        maxLength={maxChars}
        placeholder={success ? "Comment added!" : "Add Comment..."}
        className={`w-full bg-transparent outline-none mr-2 text-black placeholder:italic pr-16 ${
          success ? "placeholder:text-green-600" : "placeholder:text-gray-500"
        }`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      {input.length > 0 && (
        <span className="absolute right-24 bottom-2 text-[10px] text-gray-500">
          {input.length}/{maxChars}
        </span>
      )}
      <div className="flex items-center gap-4 relative">
        <button
          type="button"
          disabled={loading}
          onClick={() => setShowPicker((prev) => !prev)}
        >
          <Smile className="transition-all duration-300 hover:text-sky-400 text-sky-400" />
        </button>
        {showPicker && (
          <div
            ref={pickerRef}
            className="absolute bottom-full right-0 mb-2 z-50"
          >
            <EmojiPicker onEmojiClick={handleEmojiSelect} />
          </div>
        )}

        <button type="submit" disabled={loading}>
          <MessageCircle className="transition-all duration-300 hover:text-sky-400 text-sky-400" />
        </button>
      </div>
    </form>
  );
}
