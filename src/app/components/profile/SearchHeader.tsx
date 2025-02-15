"use client";
import { useState } from "react";
import { Search } from "lucide-react";

export default function SearchHeader() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <form
      className={`flex items-center rounded-full transition-all duration-300 ${
        isFocused ? "bg-sky-200" : "bg-stone-200"
      }`}
    >
      <input
        type="text"
        name="q"
        placeholder="Search for Pictures, Collections, Authors, or Tags"
        className={`outline-none p-2 ml-4 transition-all duration-300 text-sky-900 w-[600px] ${
          isFocused ? "bg-sky-200" : "bg-stone-200"
        }`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <button className="ml-2 mr-4 text-sky-500 hover:text-sky-700">
        <Search />
      </button>
    </form>
  );
}
