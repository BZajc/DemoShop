"use client";

import { useState, useEffect } from "react";
import CreatePost from "./CreatePost";
import SearchInput from "./SearchInput";
import { CirclePlus } from "lucide-react";

export default function SearchHeaderWithPublishButton() {
  const [showAddPost, setShowAddPost] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showAddPost ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showAddPost]);

  return (
    <div className="flex w-full gap-4">
      <SearchInput />
      <button
        className="p-2 rounded-full bg-sky-200 hover:bg-sky-400 hover:text-white transition-colors duration-300 text-sky-900"
        onClick={() => setShowAddPost(true)}
      >
        <CirclePlus />
      </button>
      {showAddPost && <CreatePost setShowAddPost={setShowAddPost} />}
    </div>
  );
}
