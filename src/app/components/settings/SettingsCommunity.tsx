"use client";

import { removeContact } from "@/app/api/actions/contacts/removeContact";
import { cancelContactRequest } from "@/app/api/actions/contacts/cancelContactRequest";
import { acceptContactRequest } from "@/app/api/actions/contacts/acceptContactRequest";
import { followUser } from "@/app/api/actions/follows/followUser";
import Link from "next/link";
import { useState } from "react";

interface SettingsCommunityProps {
  userId: string;
  contacts: any[];
  followed: any[];
}

export default function SettingsCommunity({
  userId,
  contacts,
  followed,
}: SettingsCommunityProps) {
  const [toast, setToast] = useState<string | null>(null);

  const sent = contacts.filter(
    (c) => c.senderId === userId && c.status === "pending"
  );
  const received = contacts.filter(
    (c) => c.receiverId === userId && c.status === "pending"
  );
  const accepted = contacts.filter((c) => c.status === "accepted");

  const handleAccept = async (senderId: string) => {
    const res = await acceptContactRequest(senderId);
    if (!res.success) {
      setToast(res.message || "Failed to accept invitation.");
    } else {
      window.location.reload();
    }
  };

  const handleRemove = async (userId: string) => {
    await removeContact(userId);
    window.location.reload();
  };

  const handleCancel = async (userId: string) => {
    await cancelContactRequest(userId);
    window.location.reload();
  };

  const handleUnfollow = async (userId: string) => {
    await followUser(userId);
    window.location.reload();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow space-y-8">
      <h2 className="text-2xl font-bold text-sky-900">Community</h2>

      {/* Toast notification */}
      {toast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow z-50 animate-fade-in">
          {toast}
        </div>
      )}

      {/* Accepted Contacts */}
      <section>
        <h3 className="font-semibold text-sky-800 mb-2">Contacts</h3>
        <ul className="space-y-2">
          {accepted.map((c) => {
            const other = c.senderId === userId ? c.receiver : c.sender;
            return (
              <li
                key={other.id}
                className="flex justify-between items-center bg-sky-50 p-2 rounded"
              >
                <Link
                  href={`/profile/${other.name}/${other.hashtag}`}
                  className="hover:underline text-sky-700"
                >
                  @{other.name}
                </Link>
                <button
                  onClick={() => handleRemove(other.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Pending Received Requests */}
      <section>
        <h3 className="font-semibold text-sky-800 mb-2">Pending Requests</h3>
        <ul className="space-y-2">
          {received.map((c) => (
            <li
              key={c.id}
              className="flex justify-between items-center bg-yellow-50 p-2 rounded"
            >
              <Link
                href={`/profile/${c.sender.name}/${c.sender.hashtag}`}
                className="hover:underline text-sky-700"
              >
                @{c.sender.name}
              </Link>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAccept(c.sender.id)}
                  className="bg-sky-500 hover:bg-sky-600 text-white text-xs rounded px-2 py-1"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRemove(c.sender.id)}
                  className="bg-red-500 hover:bg-red-600 text-white text-xs rounded px-2 py-1"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Sent Invitations */}
      <section>
        <h3 className="font-semibold text-sky-800 mb-2">Sent Invitations</h3>
        <ul className="space-y-2">
          {sent.map((c) => (
            <li
              key={c.id}
              className="flex justify-between items-center bg-gray-100 p-2 rounded"
            >
              <Link
                href={`/profile/${c.receiver.name}/${c.receiver.hashtag}`}
                className="hover:underline text-sky-700"
              >
                @{c.receiver.name}
              </Link>
              <button
                onClick={() => handleCancel(c.receiver.id)}
                className="text-sm text-red-600 hover:underline"
              >
                Cancel
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Followed Users */}
      <section>
        <h3 className="font-semibold text-sky-800 mb-2">Followed Users</h3>
        <ul className="space-y-2">
          {followed.map((user) => (
            <li
              key={user.id}
              className="flex justify-between items-center bg-sky-100 p-2 rounded"
            >
              <Link
                href={`/profile/${user.name}/${user.hashtag}`}
                className="hover:underline text-sky-700"
              >
                @{user.name}
              </Link>
              <button
                onClick={() => handleUnfollow(user.id)}
                className="text-sm text-red-600 hover:underline"
              >
                Unfollow
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
