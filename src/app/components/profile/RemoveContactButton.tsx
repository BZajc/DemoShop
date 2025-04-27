"use client";

import { removeContact } from "@/app/api/actions/contacts/removeContact";

export default function RemoveContactButton({ userId }: { userId: string }) {
  return (
    <button
      onClick={async () => {
        await removeContact(userId);
        window.location.reload();
      }}
      className="px-4 py-2 text-sm bg-red-500 font-medium text-white rounded-full hover:bg-red-600 transition"
    >
      Remove from contacts
    </button>
  );
}
