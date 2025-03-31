"use client";

import { useEffect, useState } from "react";
import { getAllContacts } from "@/app/api/actions/contacts/getAllContacts";
import { useContactContext } from "@/app/context/ContactContext";
import Image from "next/image";
import { User } from "lucide-react";
import { isUserOnline } from "@/lib/isUserOnline";

interface ContactUser {
  id: string;
  name: string;
  hashtag: string | null;
  avatarPhoto: string | null;
  lastSeenAt: Date | null;
}

export default function AllContacts() {
  const [users, setUsers] = useState<ContactUser[]>([]);
  const { setSelectedUserId } = useContactContext();

  useEffect(() => {
    async function fetchContacts() {
      const data = await getAllContacts();
      setUsers(data);
    }

    fetchContacts();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {users.length === 0 ? (
        <p className="text-sm text-sky-900">You have no contacts</p>
      ) : (
        users.map((user) => {
          const online = isUserOnline(user.lastSeenAt);

          return (
            <div
              key={user.id}
              onClick={() => setSelectedUserId(user.id)}
              className="flex items-center gap-4 p-2 rounded-xl hover:bg-sky-100 transition-all cursor-pointer"
            >
              <div className="relative w-[50px] h-[50px]">
                {user.avatarPhoto ? (
                  <Image
                    src={user.avatarPhoto}
                    alt="avatar"
                    width={50}
                    height={50}
                    className={`rounded-full object-cover w-full h-full border-2 ${
                      online ? "border-green-400" : "border-gray-300"
                    }`}
                  />
                ) : (
                  <div
                    className={`w-[50px] h-[50px] rounded-full bg-gray-300 flex items-center justify-center border-2 ${
                      online ? "border-green-400" : "border-gray-300"
                    }`}
                  >
                    <User className="text-gray-500 w-6 h-6" />
                  </div>
                )}
              </div>
              <p className="text-sky-900 font-medium text-sm">
                {user.name}
                {user.hashtag && `#${user.hashtag}`}
              </p>
            </div>
          );
        })
      )}
    </div>
  );
}
