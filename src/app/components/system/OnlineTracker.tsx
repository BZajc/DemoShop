"use client";

import { useEffect } from "react";

export default function OnlineTracker() {
  useEffect(() => {
    const interval = setInterval(() => {
      fetch("/api/heartbeat", { method: "POST" });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
