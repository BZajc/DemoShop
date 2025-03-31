"use client";

import { useEffect, useState } from "react";
import { getRecentConversations } from "@/app/api/actions/contacts/getRecentConversations";
import { User } from "lucide-react";
import Image from "next/image";
import { isUserOnline } from "@/lib/isUserOnline";
import { useContactContext } from "@/app/context/ContactContext";
import { useSession } from "next-auth/react";

interface ConversationUser {
  id: string;
  name: string;
  hashtag: string | null;
  avatarPhoto: string | null;
  lastSeenAt: Date | null;
}

interface Conversation {
  id: string;
  content: string;
  createdAt: Date;
  senderId: string;
  receiverId: string;
  sender: ConversationUser;
  receiver: ConversationUser;
  viewedAt: Date | null;
}

export default function RecentMessages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { setSelectedUserId } = useContactContext();

  const { data: session } = useSession();

  return (
    <div className="flex flex-col gap-4">
      {conversations.length === 0 ? (
        <p className="text-sm text-sky-900">No recent conversations</p>
      ) : (
        conversations.map((msg) => {
          const otherUser =
            msg.senderId === session?.user?.id ? msg.receiver : msg.sender;

          const online = isUserOnline(otherUser.lastSeenAt);

          return (
            <div
              key={msg.id}
              onClick={() => setSelectedUserId(otherUser.id)}
              className="flex items-center gap-4 p-2 rounded-xl hover:bg-sky-100 transition-all cursor-pointer"
            >
              <div
                className={`w-[50px] h-[50px] rounded-full flex items-center justify-center border-2 ${
                  online ? "border-green-400" : "border-gray-300"
                }`}
              >
                {otherUser.avatarPhoto ? (
                  <Image
                    src={otherUser.avatarPhoto}
                    alt="avatar"
                    width={50}
                    height={50}
                    className="object-cover rounded-full w-full h-full"
                  />
                ) : (
                  <User className="text-gray-500 w-6 h-6" />
                )}
              </div>
              <div className="flex flex-col">
                <p className="font-semibold text-sky-900">
                  {otherUser.name}
                  {otherUser.hashtag && `#${otherUser.hashtag}`}
                </p>
                <p className="text-sm text-gray-600 line-clamp-1">
                  {msg.content}
                </p>
              </div>
              <div className="ml-auto text-xs text-gray-400 whitespace-nowrap">
                {msg.createdAt.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
