"use client";

import { useEffect, useRef, useState } from "react";
import { followUser } from "@/app/api/actions/followUser";

export default function UnfollowButton({
  userId,
  userName,
}: {
  userId: string;
  userName: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleUnfollowClick = () => {
    setConfirming(true);
    timerRef.current = setTimeout(() => setConfirming(false), 5000);
  };

  const handleConfirm = async () => {
    await followUser(userId); // toggles follow -> unfollow
    location.reload(); // refresh page to update list
  };

  // Click outside to cancel
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".unfollow-button")) {
        setConfirming(false);
        clearTimeout(timerRef.current!);
      }
    };

    if (confirming) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [confirming]);

  return (
    <div className="unfollow-button">
      {confirming ? (
        <button
          onClick={handleConfirm}
          className="px-4 py-1 rounded-full bg-red-100 text-red-600 font-medium text-sm hover:bg-red-200 transition"
        >
          Are you sure?
        </button>
      ) : (
        <button
          onClick={handleUnfollowClick}
          className="px-4 py-1 rounded-full bg-red-500 text-white font-medium text-sm hover:bg-red-600 transition"
        >
          Unfollow
        </button>
      )}
    </div>
  );
}
