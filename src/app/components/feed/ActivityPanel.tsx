"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { getRecentlyVisited } from "@/app/api/actions/userData/getRecentlyVisited";
import { getOnlineContactsPaginated } from "@/app/api/actions/contacts/getOnlineContactsPaginated";
import { User as UserIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import UserListModal from "../other/UserListModal";
import RecentlyVisitedModal from "../other/RecentlyVisitedModal";
import { getOnlineContacts } from "@/app/api/actions/contacts/getOnlineContacts";

interface User {
  id: string;
  name: string;
  realName?: string | null;
  avatarPhoto?: string | null;
  hashtag: string;
}

export default function ActivityPanel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastClick = useRef<{
    time: number;
    type: "online" | "recentlyVisited";
  } | null>(null);

  const { data: session } = useSession();

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const [recentlyVisited, setRecentlyVisited] = useState<User[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [activeList, setActiveList] = useState<"recentlyVisited" | "online">(
    "recentlyVisited"
  );
  const [showModal, setShowModal] = useState<
    null | "online" | "recentlyVisited"
  >(null);

  useEffect(() => {
    async function fetchRecentlyVisited() {
      const users = await getRecentlyVisited();
      setRecentlyVisited(
        users.filter((u) => u.hashtag !== null).slice(0, 50) as User[]
      );
    }

    async function fetchOnline() {
      const online = await getOnlineContacts();
      setOnlineUsers(online.filter((u) => u.hashtag !== null) as User[]);
    }

    fetchRecentlyVisited();
    if (session?.user?.id) {
      fetchOnline();
    }
  }, [session?.user?.id]);

  const handleListChange = (listType: "recentlyVisited" | "online") => {
    setActiveList(listType);
  };

  const handleDoubleClick = (type: "online" | "recentlyVisited") => {
    const now = Date.now();

    if (
      lastClick.current &&
      lastClick.current.type === type &&
      now - lastClick.current.time < 500
    ) {
      setShowModal(type);
    } else {
      handleListChange(type);
    }

    lastClick.current = { time: now, type };
  };

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

  const usersToDisplay =
    activeList === "recentlyVisited" ? recentlyVisited : onlineUsers;

  return (
    <div className="flex flex-col m-4 mt-12 select-none">
      <div className="flex">
        <button
          onClick={() => handleDoubleClick("online")}
          className={`p-2 px-4 rounded-full text-sky-900 transition-all duration-300 hover:text-white hover:bg-sky-400 
            ${
              activeList === "online" ? "bg-sky-400 text-white" : "bg-stone-200"
            }`}
        >
          Online {onlineUsers.length}
        </button>

        <button
          onClick={() => handleDoubleClick("recentlyVisited")}
          className={`p-2 px-4 ml-4 rounded-full text-sky-900 transition-all duration-300 hover:text-white hover:bg-sky-400 
            ${
              activeList === "recentlyVisited"
                ? "bg-sky-400 text-white"
                : "bg-stone-200"
            }`}
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
        {usersToDisplay.length > 0 ? (
          usersToDisplay.map((user) => (
            <Link
              key={user.id}
              href={`/profile/${user.name}/${user.hashtag}`}
              className="flex flex-col items-center relative transition-all duration-300 hover:scale-[1.1]"
            >
              <div className="w-[50px] h-[50px] rounded-full overflow-hidden flex items-center justify-center bg-gray-200 border-2 border-white">
                {user.avatarPhoto ? (
                  <Image
                    src={user.avatarPhoto}
                    alt={`${user.name}'s avatar`}
                    width={50}
                    height={50}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <UserIcon className="w-6 h-6 text-gray-500" />
                )}
              </div>
              <p className="text-sm text-sky-900 mt-2">{user.name}</p>
            </Link>
          ))
        ) : (
          <p className="text-sm text-sky-900">
            {activeList === "online"
              ? "No online users"
              : "No recently visited users"}
          </p>
        )}
      </div>

      {showModal === "online" && (
        <UserListModal onClose={() => setShowModal(null)} />
      )}
      {showModal === "recentlyVisited" && (
        <RecentlyVisitedModal onClose={() => setShowModal(null)} />
      )}
    </div>
  );
}
