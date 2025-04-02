"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Smile } from "lucide-react";
import { useContactContext } from "@/app/context/ContactContext";
import { useSession } from "next-auth/react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

interface Props {
  onSend: (content: string) => void;
}

export default function MessageInput({ onSend }: Props) {
  const { selectedUserId } = useContactContext();
  const [content, setContent] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const { data: session } = useSession();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isPending || !selectedUserId) return;

    setIsPending(true);
    await onSend(content.trim());
    setContent("");
    setIsPending(false);
    setShowPicker(false);
  };

  const handleEmojiSelect = (emoji: EmojiClickData) => {
    setContent((prev) => prev + emoji.emoji);
  };

  if (!session?.user?.id) return null;

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center gap-2 p-4 border-t border-gray-200"
    >
      <input
        type="text"
        placeholder="Type your message..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
      />
      <button
        type="button"
        onClick={() => setShowPicker((prev) => !prev)}
        className="p-2 text-gray-600 hover:text-sky-400 transition"
      >
        <Smile size={18} />
      </button>
      <button
        type="submit"
        disabled={isPending || !content.trim()}
        className="p-2 rounded-full bg-sky-400 text-white hover:bg-sky-500 transition disabled:opacity-50"
      >
        <Send size={18} />
      </button>

      {showPicker && (
        <div
          className="absolute bottom-full mb-2 right-16 z-10"
          ref={pickerRef}
        >
          <EmojiPicker onEmojiClick={handleEmojiSelect} />
        </div>
      )}
    </form>
  );
}
