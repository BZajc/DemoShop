"use client";

import { useEffect, useState } from "react";
import { getRecentConversations } from "@/app/api/actions/contacts/getRecentConversations";
import { User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Conversation = Awaited<ReturnType<typeof getRecentConversations>>[number];

export default function RecentMessages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchConversations = async () => {
      const data = await getRecentConversations();
      setConversations(data);
    };

    fetchConversations();

    const channel = supabase
      .channel("recent-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "Message" },
        () => {
          // Re-fetch when new message is inserted
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (conversations.length === 0) {
    return <p className="text-sm text-sky-900">No recent conversations</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {conversations
        .filter((c) => c.user) // ← ignore undefined user
        .map(({ user, message }) => {
          const time = new Date(message.created_at);
          const formattedTime = time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div
              key={user.id}
              onClick={() =>
                router.push(`/contacts/${user.name}/${user.hashtag}`)
              }
              className="flex items-center gap-4 p-2 rounded-xl hover:bg-sky-100 transition-all cursor-pointer"
            >
              <div className="relative min-w-[50px] h-[50px]">
                {user.avatarPhoto ? (
                  <Image
                    src={user.avatarPhoto}
                    alt="avatar"
                    width={50}
                    height={50}
                    className="rounded-full object-cover w-full h-full border-2 border-gray-300"
                  />
                ) : (
                  <div className="w-[50px] h-[50px] rounded-full bg-gray-300 flex items-center justify-center border-2 border-gray-300">
                    <User className="text-gray-500 w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="flex flex-col w-full">
                <div className="flex justify-between items-center">
                  <p className="text-sky-900 font-semibold text-sm">
                    {user.name}
                    {user.hashtag && `#${user.hashtag}`}
                  </p>
                  <p className="text-gray-400 text-xs">{formattedTime}</p>
                </div>
                {user.realName && (
                  <p className="text-gray-500 text-sm">{user.realName}</p>
                )}
                <p className="text-gray-500 text-xs line-clamp-1">
                  {message.content}
                </p>
              </div>
            </div>
          );
        })}
    </div>
  );
}
