"use client";

import { useState } from "react";
import RecentMessages from "@/app/components/contacts/sections/RecentMessages";
import OnlineUsers from "@/app/components/contacts/sections/OnlineUsers";
import AllContacts from "@/app/components/contacts/sections/AllContacts";

export default function LeftPanel() {
  const [activeTab, setActiveTab] = useState<
    "recent" | "online" | "followed" | "all"
  >("recent");

  return (
    <div className="h-full flex flex-col">
      {/* Buttons */}
      <div className="flex flex-wrap gap-2 p-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("recent")}
          className={`px-4 py-2 rounded-full text-sm ${
            activeTab === "recent"
              ? "bg-sky-400 text-white"
              : "bg-stone-200 text-sky-900 hover:bg-sky-300 hover:text-white"
          }`}
        >
          Recent
        </button>
        <button
          onClick={() => setActiveTab("online")}
          className={`px-4 py-2 rounded-full text-sm ${
            activeTab === "online"
              ? "bg-sky-400 text-white"
              : "bg-stone-200 text-sky-900 hover:bg-sky-300 hover:text-white"
          }`}
        >
          Online
        </button>

        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-full text-sm ${
            activeTab === "all"
              ? "bg-sky-400 text-white"
              : "bg-stone-200 text-sky-900 hover:bg-sky-300 hover:text-white"
          }`}
        >
          All Contacts
        </button>
      </div>

      {/* Section content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "recent" && <RecentMessages />}
        {activeTab === "online" && <OnlineUsers />}
        {activeTab === "all" && <AllContacts />}
      </div>
    </div>
  );
}
