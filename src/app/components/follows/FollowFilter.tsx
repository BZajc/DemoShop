"use client";

import { useState } from "react";
import FollowedUserCard from "./FollowedUserCard";

interface User {
  id: string;
  name: string;
  hashtag: string | null;
  realName: string | null;
  avatarPhoto: string | null;
}

export default function FollowFilter({ initialUsers }: { initialUsers: User[] }) {
  const [search, setSearch] = useState("");

  const filtered = initialUsers.filter((user) => {
    const fullName = `${user.name} ${user.realName || ""}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  return (
    <>
      <input
        type="text"
        placeholder="Search users..."
        className="mb-4 p-2 border border-gray-300 rounded w-full max-w-md"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="grid gap-4">
        {filtered.map((user) => (
          <FollowedUserCard key={user.id} user={user} />
        ))}
        {filtered.length === 0 && (
          <p className="text-gray-500 text-sm">No users match your search.</p>
        )}
      </div>
    </>
  );
}
