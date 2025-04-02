"use server";

import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabaseClient";
import prisma from "@/lib/prisma";

type RecentConversation = {
  user: {
    id: string;
    name: string;
    hashtag: string | null;
    realName: string | null;
    avatarPhoto: string | null;
  };
  message: {
    content: string;
    created_at: string;
  };
};

export async function getRecentConversations(): Promise<RecentConversation[]> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return [];

  const { data: messages, error } = await supabase
    .from("Message")
    .select("*")
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !messages) return [];

  const seen = new Set<string>();
  const recentMap: Map<string, typeof messages[number]> = new Map();

  for (const msg of messages) {
    const otherUserId =
      msg.sender_id === userId ? msg.receiver_id : msg.sender_id;

    if (!seen.has(otherUserId)) {
      seen.add(otherUserId);
      recentMap.set(otherUserId, msg);
    }
  }

  const recentUserIds = Array.from(recentMap.keys()).slice(0, 10);

  const users = await prisma.user.findMany({
    where: { id: { in: recentUserIds } },
    select: {
      id: true,
      name: true,
      hashtag: true,
      realName: true,
      avatarPhoto: true,
    },
  });

  const userMap = new Map(users.map((u) => [u.id, u]));

  const result: RecentConversation[] = recentUserIds.map((uid) => ({
    user: userMap.get(uid)!,
    message: {
      content: recentMap.get(uid)!.content,
      created_at: recentMap.get(uid)!.created_at,
    },
  }));

  return result;
}
