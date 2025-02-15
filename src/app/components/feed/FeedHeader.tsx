"use client";
import { Search } from "lucide-react";
import { useState } from "react";

export default function FeedHeader() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <header className="flex m-4">
      <form
        className={`flex items-center rounded-full flex-1 transition-all duration-300 ${
          isFocused ? "bg-sky-200" : "bg-stone-200"
        }`}
      >
        <input
          type="text"
          name="q"
          placeholder="Search for Pictures, Collections, Authors, or Tags"
          className={`w-full outline-none px-2 ml-4 transition-all duration-300 text-sky-900 ${
            isFocused ? "bg-sky-200" : "bg-stone-200"
          }`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <button className="ml-2 mr-4 text-sky-500 hover:text-sky-700">
          <Search />
        </button>
      </form>

      {/* Publish Button */}
      <button className="p-4 rounded-full ml-4 bg-sky-200 hover:bg-sky-400 hover:text-white transition-colors duration-300 text-sky-900">
        Publish Picture
      </button>
    </header>
  );
}
