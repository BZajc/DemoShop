"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useContactContext } from "@/app/context/ContactContext";
import { useSession } from "next-auth/react";
import { getSupabaseMessagesWithUser } from "@/app/api/actions/contacts/getSupabaseMessagesWithUser";
import { getContactStatus } from "@/app/api/actions/contacts/getContactStatus";
import MessageInput from "./MessageInput";
import { supabase } from "@/lib/supabaseClient";
import { sendSupabaseMessage } from "@/app/api/actions/contacts/sendSupabaseMessage";
import Image from "next/image";
import { User as UserIcon } from "lucide-react";
import Link from "next/link";
import { getAvatars } from "@/app/api/actions/contacts/getAvatars";
import { Menu } from "lucide-react";
import MobileLeftPanel from "./MobileLeftPanel";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  viewed_at: string | null;
  isPending?: boolean;
}

interface ChatWindowProps {
  contactUser: {
    id: string;
    name: string;
    hashtag: string;
    realName: string | null;
    avatarPhoto: string | null;
    lastSeenAt: string | null;
  };
}

export default function ChatWindow({ contactUser }: ChatWindowProps) {
  const { selectedUserId } = useContactContext();
  const { data: session } = useSession();

  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [userAvatars, setUserAvatars] = useState<Record<string, string | null>>(
    {}
  );
  const [contactStatus, setContactStatus] = useState<
    "accepted" | "pending" | "invited" | "received" | "none" | null
  >(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

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
    setContactStatus(null);
  }, [selectedUserId]);

  useEffect(() => {
    if (page === 0) {
      loadMessages();
    }
  }, [page, loadMessages]);

  useEffect(() => {
    const fetchAvatars = async () => {
      if (!session?.user?.id || !selectedUserId) return;
      const avatars = await getAvatars([session.user.id, selectedUserId]);
      const avatarMap = Object.fromEntries(
        avatars.map((u) => [u.id, u.avatarPhoto || null])
      );
      setUserAvatars(avatarMap);
    };
    fetchAvatars();
  }, [selectedUserId, session?.user?.id]);

  useEffect(() => {
    if (!session?.user?.id || !selectedUserId) return;

    const handleMessage = (payload: { new: Message }) => {
      const newMsg = payload.new as Message;

      const isCurrentChat =
        (newMsg.sender_id === selectedUserId &&
          newMsg.receiver_id === session.user.id) ||
        (newMsg.receiver_id === selectedUserId &&
          newMsg.sender_id === session.user.id);

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
    if (!selectedUserId) return;
    (async () => {
      const status = await getContactStatus(selectedUserId);
      setContactStatus(status);
    })();
  }, [selectedUserId]);

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
    requestAnimationFrame(() => {
      containerRef.current?.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
    await sendSupabaseMessage(selectedUserId, content, session.user.id);
  };

  if (!selectedUserId) {
    return (
      <div className="h-full flex items-center justify-center text-sky-900">
        Select a conversation to start chatting
      </div>
    );
  }

  function formatStatus(lastSeenAt: string | null): string {
    if (!lastSeenAt) return "Offline";
    const last = new Date(lastSeenAt);
    const now = new Date();
    const diff = Math.floor((now.getTime() - last.getTime()) / 1000);
    if (diff < 300) return "Online";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`;
    const days = Math.floor(diff / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="md:absolute top-4 left-4 z-10 flex items-center gap-2 bg-white p-2 rounded-xl shadow transition-opacity hover:opacity-60">
        <Link
          href={`/profile/${contactUser.name}/${contactUser.hashtag}`}
          className="flex items-center gap-3 p-2 bg-white rounded-xl shadow hover:bg-gray-50 transition"
        >
          {contactUser.avatarPhoto ? (
            <Image
              src={contactUser.avatarPhoto}
              alt={`${contactUser.name}'s avatar`}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <UserIcon className="text-gray-500 w-5 h-5" />
            </div>
          )}
          <div>
            <div className="flex flex-col">
              <p className="font-semibold text-sky-900 hover:underline">
                @{contactUser.name}
              </p>
              <p className="text-gray-400 text-xs">
                {formatStatus(contactUser.lastSeenAt)}
              </p>
            </div>
            {contactUser.realName && (
              <p className="text-gray-500 text-sm">{contactUser.realName}</p>
            )}
          </div>
        </Link>
      </div>

      {/* Messages */}
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
              const avatarUrl = userAvatars[msg.sender_id];
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${
                    isMine ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isMine &&
                    (avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt="avatar"
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <UserIcon className="text-gray-500 w-4 h-4" />
                      </div>
                    ))}
                  <div className="max-w-[75%]">
                    <div
                      className={`break-words px-4 py-2 rounded-xl text-sm shadow ${
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
                    <p className="text-[10px] text-gray-400 mt-1 text-right">
                      {new Date(msg.created_at + "Z").toLocaleTimeString(
                        undefined,
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                  {isMine &&
                    (avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt="avatar"
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <UserIcon className="text-gray-500 w-4 h-4" />
                      </div>
                    ))}
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

      {/* Message Input or Blocked */}
      {contactStatus === "accepted" ? (
        <MessageInput onSend={handleSendMessage} />
      ) : (
        <div className="text-center text-gray-500 p-4">
          This user is not in your contacts.
        </div>
      )}

      {/*(mobile) menu button in top right corner */}
      <button
        onClick={() => setMenuOpen(true)}
        className="md:hidden fixed top-4 right-4 z-50 bg-white rounded-full p-2 shadow border border-gray-300 text-sky-900 hover:text-sky-600"
        aria-label="Open contacts"
      >
        <Menu size={24} />
      </button>

      <MobileLeftPanel isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
