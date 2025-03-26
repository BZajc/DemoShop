"use client";

import { useSession } from "next-auth/react";
import { useFollowContext } from "@/app/context/FollowContext";

interface FeedFollowProps {
  userId: string;
}

export default function FeedFollow({ userId }: FeedFollowProps) {
  const { data: session } = useSession();
  const myUserId = session?.user?.id;
  const { isFollowed, toggleFollow } = useFollowContext();

  if (!myUserId || myUserId === userId) return null;

  const followed = isFollowed(userId);

  const handleClick = async () => {
    try {
      await toggleFollow(userId);
    } catch (err) {
      console.error("Follow error:", err);
    }
  };

  return (
    <>
      <p className="mx-2">·</p>
      <button
        className={`transition-all duration-300 ${
          followed ? "text-sky-400 font-semibold" : "hover:text-sky-400"
        }`}
        onClick={handleClick}
      >
        {followed ? "Followed" : "Follow"}
      </button>
    </>
  );
}
