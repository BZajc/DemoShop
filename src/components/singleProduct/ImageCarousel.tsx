"use client";

import { useState } from "react";
import NextImage from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);
  const select = (i: number) => setIndex(i);

  return (
    <div className="space-y-4">
      {/* Main image + nav */}
      <div className="relative w-full h-[400px] rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-800">
        <NextImage
          src={images[index]}
          alt={`Slide ${index + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 dark:bg-black/70 p-2 rounded-full hover:bg-white/90 dark:hover:bg-black/90 transition"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 dark:bg-black/70 p-2 rounded-full hover:bg-white/90 dark:hover:bg-black/90 transition"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex space-x-2 justify-center">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => select(i)}
            className={`relative w-16 h-16 rounded overflow-hidden border-2 ${
              i === index
                ? "border-brown-700 dark:border-white"
                : "border-transparent"
            }`}
          >
            <NextImage
              src={src}
              alt={`Thumbnail ${i + 1}`}
              fill
              sizes="128px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
