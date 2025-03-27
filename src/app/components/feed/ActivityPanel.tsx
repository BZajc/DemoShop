"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { getRecentlyVisited } from "@/app/api/actions/getRecentlyVisited";

interface User {
  id: string;
  name: string;
  realName?: string | null;
  avatarPhoto?: string | null;
  hashtag: string | null;
}

export default function ActivityPanel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Recently visited list
  const [recentlyVisited, setRecentlyVisited] = useState<User[]>([]);

  // Online List (placeholder for later)
  // const [onlineUsers, setOnlineUsers] = useState<User[]>([]);

  // Active list
  const [activeList, setActiveList] = useState<"recentlyVisited" | "online">("recentlyVisited");

  // Fetch latest visited users
  useEffect(() => {
    async function fetchRecentlyVisited() {
      const users = await getRecentlyVisited();
      setRecentlyVisited(users);
    }
    fetchRecentlyVisited();
  }, []);

  // Change list
  const handleListChange = (listType: "recentlyVisited" | "online") => {
    setActiveList(listType);
  };

  //  Scroll by using mouse button
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="flex flex-col m-4 mt-12 select-none">
      <div className="flex">
        {/* Online Button */}
        <button
          onClick={() => handleListChange("online")}
          className={`p-2 px-4 rounded-full text-sky-900 transition-all duration-300 hover:text-white hover:bg-sky-400 
            ${activeList === "online" ? "bg-sky-400 text-white" : "bg-stone-200"}`}
        >
          Online 25
        </button>

        {/* Recently Visited Button */}
        <button
          onClick={() => handleListChange("recentlyVisited")}
          className={`p-2 px-4 ml-4 rounded-full text-sky-900 transition-all duration-300 hover:text-white hover:bg-sky-400 
            ${activeList === "recentlyVisited" ? "bg-sky-400 text-white" : "bg-stone-200"}`}
        >
          Recently Visited
        </button>
      </div>

      <p className="text-sky-900 text-sm p-1">
        You can also double-click one of the buttons above to show all users.
      </p>

      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        onMouseUp={handleMouseUp}
        className="flex items-center gap-12 py-8 px-4 justify-start cursor-grab active:cursor-grabbing overflow-x-auto overflow-y-hidden custom-scrollbar scrollbar-gutter-stable"
      >
        {/* Render users list */}
        {activeList === "recentlyVisited" ? (
          recentlyVisited.length > 0 ? (
            recentlyVisited.map((user) => (
              <Link
                key={user.id}
                href={`/profile/${user.name}/${user.hashtag}`}
                className="flex flex-col items-center relative transition-all duration-300 hover:scale-[1.1]"
              >
                <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                  <Image
                    src={user.avatarPhoto || "/images/avatarPlaceholder.png"}
                    alt={`${user.name}'s avatar`}
                    width={50}
                    height={50}
                    className="object-cover rounded-full border-2 border-white"
                  />
                </div>
                <p className="text-sm text-sky-900 mt-2">{user.name}</p>
              </Link>
            ))
          ) : (
            <p className="text-sm text-sky-900">No recently visited users</p>
          )
        ) : (
          <p className="text-sm text-sky-900">No online users</p>
        )}
      </div>
    </div>
  );
}
