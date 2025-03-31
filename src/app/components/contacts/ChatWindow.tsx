"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useContactContext } from "@/app/context/ContactContext";
import { useSession } from "next-auth/react";
import { getSupabaseMessagesWithUser } from "@/app/api/actions/contacts/getSupabaseMessagesWithUser";
import MessageInput from "./MessageInput";
import { supabase } from "@/lib/supabaseClient";
import { sendSupabaseMessage } from "@/app/api/actions/contacts/sendSupabaseMessage";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  viewed_at: string | null;
  isPending?: boolean;
}

export default function ChatWindow() {
  const { selectedUserId } = useContactContext();
  const { data: session } = useSession();

  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const topRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadMessages = useCallback(async () => {
    if (!selectedUserId || !session?.user?.id || loading || !hasMore) return;

    setLoading(true);
    const newMessages = await getSupabaseMessagesWithUser({
      contactUserId: selectedUserId,
      myUserId: session.user.id,
      page,
      limit: 10,
    });

    if (newMessages.length === 0) {
      setHasMore(false);
    } else {
      setMessages((prev) => {
        const all = [...newMessages, ...prev];
        const map = new Map<string, Message>();
        all.forEach((msg) => map.set(msg.id, msg));
        return Array.from(map.values()).sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      });
      setPage((prev) => prev + 1);
    }

    setLoading(false);
    setHasLoadedOnce(true);
  }, [selectedUserId, session?.user?.id, page, loading, hasMore]);

  useEffect(() => {
    setMessages([]);
    setPage(0);
    setHasMore(true);
  }, [selectedUserId]);

  useEffect(() => {
    if (page === 0) {
      loadMessages();
    }
  }, [page, loadMessages]);

  // Handle realtime message updates
  useEffect(() => {
    if (!session?.user?.id || !selectedUserId) return;

    const handleMessage = (payload: any) => {
      const newMsg = payload.new as Message;

      const isCurrentChat =
        (newMsg.sender_id === selectedUserId &&
          newMsg.receiver_id === session?.user?.id) ||
        (newMsg.receiver_id === selectedUserId &&
          newMsg.sender_id === session?.user?.id);

      if (!isCurrentChat) return;

      setMessages((prev) => {
        const filtered = prev.filter(
          (msg) =>
            !(
              msg.id.startsWith("temp-") &&
              msg.content === newMsg.content &&
              msg.receiver_id === newMsg.receiver_id &&
              msg.sender_id === newMsg.sender_id
            )
        );

        const alreadyExists = filtered.some((msg) => msg.id === newMsg.id);
        if (alreadyExists) return filtered;

        return [...filtered, newMsg];
      });
    };

    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Message",
          filter: `receiver_id=eq.${session.user.id}`,
        },
        handleMessage
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Message",
          filter: `sender_id=eq.${session.user.id}`,
        },
        handleMessage
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, selectedUserId]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop } = containerRef.current;
    if (scrollTop < 100 && hasMore && !loading) {
      loadMessages();
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!session?.user?.id || !selectedUserId) return;

    const tempId = `temp-${Date.now()}`;

    const newMessage: Message = {
      id: tempId,
      sender_id: session.user.id,
      receiver_id: selectedUserId,
      content,
      created_at: new Date().toISOString(),
      viewed_at: null,
      isPending: true,
    };

    setMessages((prev) => [...prev, newMessage]);

    await sendSupabaseMessage(selectedUserId, content, session.user.id);
  };

  if (!selectedUserId) {
    return (
      <div className="h-full flex items-center justify-center text-sky-900">
        Select a conversation to start chatting
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex-1 overflow-y-auto p-4 space-y-2"
        onScroll={handleScroll}
        ref={containerRef}
      >
        <div ref={topRef} />
        {!loading && hasLoadedOnce && messages.length === 0 ? (
          <p className="text-gray-500">No messages yet</p>
        ) : (
          <>
            {messages.map((msg) => {
              const isMine = msg.sender_id === session?.user?.id;
              const isPending = msg.isPending;

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${
                    isMine ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isMine && (
                    <img
                      src={`/api/avatar/${msg.sender_id}`} // lub `msg.sender.avatarPhoto` jeśli masz
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}

                  <div>
                    <div
                      className={`max-w-[75%] px-4 py-2 rounded-xl text-sm shadow ${
                        isMine
                          ? isPending
                            ? "bg-sky-200 text-white opacity-60"
                            : "bg-sky-400 text-white"
                          : "bg-gray-200 text-sky-900"
                      }`}
                    >
                      {msg.content}
                      {isPending && (
                        <span className="block text-[10px] text-white mt-1">
                          Sending...
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {new Date(msg.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {isMine && (
                    <img
                      src={`/api/avatar/${session.user.id}`} // lub `session.user.image` jeśli masz
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                </div>
              );
            })}

            <div ref={bottomRef} />
          </>
        )}
        {messages.length > 0 && loading && (
          <p className="text-gray-400 text-sm">Loading more...</p>
        )}
      </div>

      <MessageInput onSend={handleSendMessage} />
    </div>
  );
}
