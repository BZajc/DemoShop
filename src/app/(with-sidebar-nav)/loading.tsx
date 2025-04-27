"use client";

import { LoaderCircle } from "lucide-react";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
      <LoaderCircle className="w-40 h-40 text-sky-500 animate-spin-smooth" />
      <div className="absolute">
        <Image
          src="/images/picbookLogo.png"
          alt="Loading Logo"
          width={60}
          height={60}
          priority
        />
      </div>
    </div>
  );
}
