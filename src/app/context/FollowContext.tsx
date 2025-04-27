"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { followUser } from "../api/actions/follows/followUser";
import { getFollowingUsersIds } from "@/app/api/actions/follows/getFollowingUsersIds";
import { useSession } from "next-auth/react";

interface FollowContextValue {
  isFollowed: (userId: string) => boolean;
  toggleFollow: (userId: string) => Promise<void>;
}

const FollowContext = createContext<FollowContextValue | null>(null);

export const FollowProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const myUserId = session?.user?.id;
  const [followedUserIds, setFollowedUserIds] = useState<Set<string>>(
    new Set()
  );

  const isFollowed = (userId: string) => followedUserIds.has(userId);

  const toggleFollow = async (userId: string) => {
    await followUser(userId);
    setFollowedUserIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(userId)) updated.delete(userId);
      else updated.add(userId);
      return updated;
    });
  };

  useEffect(() => {
    if (!myUserId) return;
    const fetchFollowed = async () => {
      const ids = await getFollowingUsersIds();
      setFollowedUserIds(new Set(ids));
    };
    fetchFollowed();
  }, [myUserId]);

  return (
    <FollowContext.Provider value={{ isFollowed, toggleFollow }}>
      {children}
    </FollowContext.Provider>
  );
};

export const useFollowContext = () => {
  const ctx = useContext(FollowContext);
  if (!ctx)
    throw new Error("useFollowContext mustbe used within FollowProvider");
  return ctx;
};
