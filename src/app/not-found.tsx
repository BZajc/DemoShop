"use client";

import Link from "next/link";
import { ArrowLeftCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white text-sky-900 animate-fade-in text-center px-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">The page you’re looking for doesn’t exist.</p>

      <Link
        href="/feed"
        className="flex items-center gap-2 px-6 py-3 bg-sky-400 text-white rounded-full shadow hover:bg-sky-500 transition-all"
      >
        <ArrowLeftCircle className="w-5 h-5" />
        Go back to feed
      </Link>
    </div>
  );
}
