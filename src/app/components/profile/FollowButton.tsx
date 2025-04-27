"use client";

import { useState, useTransition } from "react";
import { followUser } from "@/app/api/actions/follows/followUser";
import { Loader2 } from "lucide-react";

export default function FollowButton({
  initialIsFollowing,
  profileUserId,
}: {
  initialIsFollowing: boolean;
  profileUserId: string;
}) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    setIsLoading(true);
    const MIN_LOADING_TIME = 500;
    const start = Date.now();

    startTransition(async () => {
      try {
        await followUser(profileUserId);
        setIsFollowing(!isFollowing);
      } catch (err) {
        console.error("Follow error:", err);
      } finally {
        const elapsed = Date.now() - start;
        const remaining = MIN_LOADING_TIME - elapsed;

        setTimeout(() => {
          setIsLoading(false);
        }, remaining > 0 ? remaining : 0);
      }
    });
  };

  const label = isLoading ? (
    <Loader2 className="w-4 h-4 animate-spin" />
  ) : isFollowing ? (
    isHovered ? "Unfollow" : "Following"
  ) : (
    "Follow"
  );

  const baseStyle =
    "px-4 py-2 rounded-full font-medium border transition-all";
  const colorStyle = isFollowing
    ? isHovered
      ? "bg-red-100 text-red-700 border-red-300 hover:bg-red-200"
      : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
    : "bg-blue-500 text-white border-blue-500 hover:bg-blue-600";

  return (
    <button
      onClick={handleClick}
      disabled={isPending || isLoading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`${baseStyle} ${colorStyle}`}
    >
      {label}
    </button>
  );
}
