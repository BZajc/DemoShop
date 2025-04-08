"use client";

import { EllipsisVertical } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

interface PostOptionsMenuProps {
  authorId: string;
}

export default function PostOptionsMenu({ authorId }: PostOptionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  const isAuthor = session?.user?.id === authorId;

  // Close the menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="hover:text-sky-400 duration-300 transition-all"
      >
        <EllipsisVertical />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-50">
          <ul className="py-1">
            <li className="px-4 py-2 hover:bg-sky-100 cursor-pointer">
              Add To Collection
            </li>
            {!isAuthor && (
              <>
                <li className="px-4 py-2 hover:bg-sky-100 cursor-pointer">
                  Report
                </li>
              </>
            )}
            {isAuthor && (
              <>
                <li className="px-4 py-2 hover:bg-sky-100 cursor-pointer">
                  Edit
                </li>
                <li className="px-4 py-2 hover:bg-sky-100 cursor-pointer">
                  Delete
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
