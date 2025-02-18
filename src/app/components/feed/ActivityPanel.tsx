"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export default function ActivityPanel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  //  Scroll by using mouse button
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col m-4 mt-12 select-none">
      <div className="flex">
        <button className="bg-sky-200 p-2 px-4 rounded-full text-sky-900 transition-all duration-300 hover:text-white hover:bg-sky-400">
          Online 25
        </button>
        <button className="bg-stone-200 p-2 px-4 ml-4 rounded-full text-sky-900 transition-all duration-300 hover:text-white hover:bg-sky-400">
          Recently Visited
        </button>
      </div>
      <p className="text-sky-900 text-sm p-1">
        You can also double-click one of the buttons above to show all users.
      </p>
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        onMouseUp={handleMouseUp}
        className="flex items-center gap-12 py-8 px-4 justify-start cursor-grab active:cursor-grabbing overflow-x-auto overflow-y-hidden custom-scrollbar scrollbar-gutter-stable"
      >
        {[1, 2, 3, 4, 5].map((num) => (
          <button key={num} className="flex flex-col items-center relative transition-all duration-300 hover:scale-[1.1]">
            <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
              <Image
                src={`/images/loremPicture1.jpg`}
                alt="User Profile"
                fill
                className="object-cover rounded-full border-2 border-white"
              />
            </div>
            <p className="text-sm text-sky-900 mt-2 absolute top-10 whitespace-nowrap">
              {`User TEST TEST TEST ${num}`.length > 12
                ? `User TEST ${num}`.slice(0, 12) + "..."
                : `User TEST ${num}`}
            </p>
          </button>
        ))}
        <button className="flex-shrink-0 p-2 px-4 rounded-full bg-sky-200 hover:bg-sky-400 hover:text-white transition-colors duration-300 text-sky-900">
          Show all Online
        </button>

      </div>
    </div>
  );
}
