"use client";
import { useState } from "react";

export default function FeedComments() {
  const [showComments, setShowComments] = useState(false);

  return (
    <div>
      <button 
        onClick={() => setShowComments(!showComments)} 
        className="flex hover:text-sky-400 duration-300 transition-all p-2"
      >
        Comments
        <p className="mx-2">·</p>
        <p>4</p>
      </button>

      {showComments && (
        <div>
            <button>Sort by: Recent</button>
        </div>
      )}
    </div>
  );
}
