"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, Smile, User } from "lucide-react";
import Image from "next/image";
import { createComment } from "@/app/api/actions/createComment";
import { getComments } from "@/app/api/actions/getComments";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

interface Comment {
  id: string;
  content: string;
  userId: string;
  userName?: string;
  createdAt?: string;
  userAvatar?: string | null;
}

interface CommentsProps {
  postId: string;
}

function timeAgo(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 1000 / 60);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export default function Comments({ postId }: CommentsProps) {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const [sortBy, setSortBy] = useState<"recent" | "random">("recent");
  const [inputValue, setInputValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const take = 10;

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

  const loadComments = async () => {
    const fetched = await getComments({ postId, take: 1000, sortBy });
    const shuffled =
      sortBy === "random"
        ? [...fetched].sort(() => Math.random() - 0.5)
        : fetched;
    setAllComments(shuffled);
    setVisibleCount(10);
  };

  useEffect(() => {
    loadComments();
  }, [sortBy]);

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await createComment({ postId, content: inputValue });
      setInputValue("");
      loadComments();
    } catch (error) {
      console.error(error)
      setError("Failed to submit comment. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmojiSelect = (emoji: EmojiClickData) => {
    const newValue = inputValue + emoji.emoji;
    if (newValue.length <= maxChars) {
      setInputValue(newValue);
    }
  };

  const maxChars = 400;
  const visibleComments = allComments.slice(0, visibleCount);

  return (
    <div className="mt-6">
      <div>
        Comments <span className="mx-2">·</span> {allComments.length}
      </div>
      <div className="mt-4">
        <div className="mb-4 flex items-center gap-4">
          <span className="text-sm text-white">Sort by:</span>
          <div className="relative inline-block text-left">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "recent" | "random")}
              className="appearance-none bg-white/10 text-white font-medium px-4 py-1 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all [&>option]:bg-neutral-800 [&>option]:text-white"
            >
              <option value="recent">Recent</option>
              <option value="random">Random</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {visibleComments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-4 items-start bg-white/10 p-3 rounded-lg"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden">
                {comment.userAvatar ? (
                  <Image
                    src={comment.userAvatar}
                    alt="User avatar"
                    width={40}
                    height={40}
                    className="object-cover rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <User size={20} className="text-gray-500" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center text-xs text-gray-300">
                  <span className="font-semibold">
                    {comment.userName || "Anonymous"}
                  </span>
                  {comment.createdAt && (
                    <span>{timeAgo(comment.createdAt)}</span>
                  )}
                </div>
                <p className="text-sm text-white mt-1">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>

        {visibleCount < allComments.length && (
          <button
            onClick={() => setVisibleCount((prev) => prev + take)}
            className="mt-4 text-sm text-sky-400 hover:underline"
          >
            Show more comments
          </button>
        )}

        <div className="mt-6 flex items-center gap-2 relative">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            maxLength={maxChars}
            className="flex-1 rounded-xl p-3 text-white bg-white/10 border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all resize-none pr-16"
            placeholder="Write a comment..."
          />
          {inputValue.length > 0 && (
            <span className="absolute right-24 bottom-2 text-[10px] text-gray-400">
              {inputValue.length}/{maxChars}
            </span>
          )}
          <div className="flex flex-col gap-2">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="p-2 hover:text-sky-400 disabled:opacity-50"
            >
              <MessageCircle />
            </button>
            <button
              type="button"
              onClick={() => setShowPicker((prev) => !prev)}
              className="p-2 hover:text-sky-400"
            >
              <Smile />
            </button>
            {showPicker && (
              <div className="absolute bottom-full mb-2" ref={pickerRef}>
                <EmojiPicker onEmojiClick={handleEmojiSelect} />
              </div>
            )}
          </div>
        </div>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
}
