"use client";
import { useState } from "react";
import Image from "next/image";

export default function PostImageModal({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Thumbnail */}
      <div
        onClick={() => setOpen(true)}
        className="relative w-full h-[300px] mb-4 cursor-pointer"
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      {/* Modal */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
        >
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={800}
            className="rounded-lg object-contain max-h-[90vh] max-w-[90vw]"
          />
        </div>
      )}
    </>
  );
}
