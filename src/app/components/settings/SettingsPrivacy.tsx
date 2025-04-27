"use client";

import { clearRecentlyVisited } from "@/app/api/actions/userData/clearRecentlyVisited";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";

export default function SettingsPrivacy() {
  const [cleared, setCleared] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleClear = () => {
    startTransition(async () => {
      await clearRecentlyVisited();
      setCleared(true);
    });
  };

  return (
    <div className="bg-white rounded shadow p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-sky-900 mb-4">
          Privacy Settings
        </h2>

        <button
          onClick={handleClear}
          disabled={isPending}
          className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : cleared ? (
            "Recently Visited Cleared!"
          ) : (
            "Clear Recently Visited"
          )}
        </button>
      </div>

    </div>
  );
}
