"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { useContactContext } from "@/app/context/ContactContext";
import { useSession } from "next-auth/react";

interface Props {
  onSend: (content: string) => void;
}

export default function MessageInput({ onSend }: Props) {
  const { selectedUserId } = useContactContext();
  const [content, setContent] = useState("");
  const [isPending, setIsPending] = useState(false);

  const { data: session } = useSession();

  if (!session?.user?.id) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() || isPending || !selectedUserId) return;

    setIsPending(true);
    await onSend(content.trim());
    setContent("");
    setIsPending(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 p-4 border-t border-gray-200"
    >
      <input
        type="text"
        placeholder="Type your message..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
      />
      <button
        type="submit"
        disabled={isPending || !content.trim()}
        className="p-2 rounded-full bg-sky-400 text-white hover:bg-sky-500 transition disabled:opacity-50"
      >
        <Send size={18} />
      </button>
    </form>
  );
}
