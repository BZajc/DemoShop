"use client";
import { DoorClosed, DoorOpen } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

export default function LogoutButton() {
  const [isHovered, setIsHovered] = useState(false);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/sign?form=login" });
  };

  return (
    <button
      className="p-4 flex items-center hover:text-rose-600 cursor-pointer transform hover:scale-105 transition-all duration-300 hover:bg-sky-700 rounded-full text-sky-200 text-2xl md:text-base"
      onClick={handleLogout}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered ? <DoorOpen className="mr-2" strokeWidth={1.5} /> : <DoorClosed className="mr-2" strokeWidth={1.5} />}
      Log Out
    </button>
  );
}
