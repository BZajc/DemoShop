"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { User as UserIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { getFollowedProfiles } from "@/app/api/actions/follows/getFollowedProfiles";

interface FollowedUser {
  id: string;
  name: string;
  hashtag: string | null;
  avatarPhoto: string | null;
  lastSeenAt: Date | null;
}

export default function FollowSideBar() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<FollowedUser[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await getFollowedProfiles();
        // filter out self just in case
        const filtered = result.filter((u) => u.id !== session?.user?.id);
        setUsers(filtered);
      } catch (error) {
        console.error("Failed to load followed users", error);
      }
    };

    fetchUsers();
  }, [session?.user?.id]);

  if (users.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 flex flex-col items-center gap-4">
      {users.map((user) => (
        <Link
          key={user.id}
          href={`/profile/${user.name}/${user.hashtag}`}
          className="group relative w-12 h-12 rounded-full hover:scale-105 transition"
        >
          {user.avatarPhoto ? (
            <Image
              src={user.avatarPhoto}
              alt={`${user.name} avatar`}
              width={48}
              height={48}
              className="rounded-full object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center">
              <UserIcon className="text-gray-500 w-5 h-5" />
            </div>
          )}
          <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap bg-white text-sky-900 text-xs font-medium px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition">
            @{user.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
