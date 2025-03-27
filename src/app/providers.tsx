"use client";

import { SessionProvider } from "next-auth/react";
import { FollowProvider } from "./context/FollowContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <FollowProvider>{children}</FollowProvider>
    </SessionProvider>
  );
}
