"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { followUser } from "@/app/api/actions/followUser";
import { useSession } from "next-auth/react";

interface FollowContextValue {
  isFollowed: (userId: string) => boolean;
  toggleFollow: (userId: string) => Promise<void>;
}

const FollowContext = createContext<FollowContextValue | undefined>(undefined);

export const FollowProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const myUserId = session?.user?.id;
  const [followedUserIds, setFollowedUserIds] = useState<Set<string>>(new Set());

  const isFollowed = (userId: string) => followedUserIds.has(userId);

  const toggleFollow = async (userId: string) => {
    await followUser(userId);
    setFollowedUserIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) newSet.delete(userId);
      else newSet.add(userId);
      return newSet;
    });
  };

  return (
    <FollowContext.Provider value={{ isFollowed, toggleFollow }}>
      {children}
    </FollowContext.Provider>
  );
};

export const useFollowContext = () => {
  const context = useContext(FollowContext);
  if (!context) throw new Error("useFollowContext must be used within FollowProvider");
  return context;
};
