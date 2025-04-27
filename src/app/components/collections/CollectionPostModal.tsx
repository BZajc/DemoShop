"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { Download, Trash2, Loader2 } from "lucide-react";
import { removePostFromCollection } from "@/app/api/actions/collections/removePostFromCollection";

interface CollectionPostModalProps {
  postId: string;
  imageUrl: string;
  title: string;
  collectionId: string;
  onPostRemoved: (postId: string) => void;
}

export default function CollectionPostModal({
  postId,
  imageUrl,
  title,
  collectionId,
  onPostRemoved,
}: CollectionPostModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRemove = async () => {
    setRemoving(true);
    setError(null);

    const res = await removePostFromCollection(postId, collectionId);

    if (res.success) {
      onPostRemoved(postId);
      setIsOpen(false);
    } else {
      setError(res.error || "Failed to remove from collection");
    }

    setRemoving(false);
  };

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="cursor-pointer relative w-full h-48 group overflow-hidden rounded-lg"
      >
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition" />
      </div>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-xl max-h-[90vh] w-auto max-w-full p-4 overflow-hidden"
          >
            <div className="flex justify-end gap-2 mb-4">
              <Link
                href={`/post/${postId}`}
                className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 transition text-sm"
              >
                Go to Post
              </Link>
              <button
                onClick={async () => {
                  const response = await fetch(imageUrl);
                  const blob = await response.blob();
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = title || "image.jpg";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center gap-1 bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200 transition text-sm"
              >
                <Download size={16} />
                Download
              </button>
              <button
                onClick={handleRemove}
                disabled={removing}
                className="flex items-center gap-1 bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 transition text-sm disabled:opacity-50"
              >
                {removing ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                Delete from Collection
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-500 mb-2 text-center">{error}</p>
            )}

            <div className="relative max-h-[80vh] max-w-full mx-auto">
              <Image
                src={imageUrl}
                alt={title}
                width={1000}
                height={1000}
                className="object-contain max-h-[80vh] h-auto w-auto mx-auto"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
