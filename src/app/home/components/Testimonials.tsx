"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";

const testimonials = [
  { id: 1, name: "Alice", text: "Great store, fast delivery!" },
  { id: 2, name: "Bob", text: "Excellent prices and support." },
  { id: 3, name: "Carla", text: "I will definitely shop here again!" },
  { id: 4, name: "Diana", text: "Customer service was super helpful." },
  { id: 5, name: "Ethan", text: "Huge selection of quality products." },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-[80px] px-4 sm:px-8 lg:px-12 flex items-center justify-center">
      {testimonials.map((t, index) => (
        <div
          key={t.id}
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ease-in-out ${
            index === activeIndex ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="text-center max-w-xl mx-auto">
            <MessageCircle className="w-6 h-6 text-blue-600 mb-2 mx-auto" />
            <p className="text-lg sm:text-xl italic text-brown-800 dark:text-brown-100 leading-relaxed">
              “{t.text}”
            </p>
            <p className="text-sm font-semibold text-brown-700 dark:text-brown-200">
              — {t.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
