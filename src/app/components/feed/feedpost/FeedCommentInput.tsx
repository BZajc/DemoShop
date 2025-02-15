"use client";
import { useState } from "react";
import { MessageCircle, Smile, Paperclip } from "lucide-react";

export default function FeedCommentInput() {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <form
      className={`flex p-2 m-2 rounded-full transition-all duration-300 ${
        isFocused ? "bg-white" : "bg-stone-200"
      }`}
    >
      <input
        type="text"
        placeholder="Add Comment..."
        className="w-full bg-transparent outline-none mr-2"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <div className="flex items-center gap-4">
        <button type="submit">
          <Paperclip className="transition-all duration-300 hover:text-sky- text-sky-400" />
        </button>
        <button type="submit">
          <Smile className="transition-all duration-300 hover:text-sky- text-sky-400" />
        </button>
        <button type="submit">
          <MessageCircle className="transition-all duration-300 hover:text-sky- text-sky-400" />
        </button>
      </div>
    </form>
  );
}
