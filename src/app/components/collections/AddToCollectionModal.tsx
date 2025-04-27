"use client";

import { useEffect, useState } from "react";
import { createCollection } from "@/app/api/actions/collections/createCollection";
import { addPostToCollection } from "@/app/api/actions/collections/addPostToCollection";
import { getUserCollections } from "@/app/api/actions/collections/getUserCollections";
import { Loader2, X } from "lucide-react";

interface AddToCollectionModalProps {
  postId: string;
  onClose: () => void;
}

export default function AddToCollectionModal({
  postId,
  onClose,
}: AddToCollectionModalProps) {
  const [collections, setCollections] = useState<
    {
      id: string;
      name: string;
      previewImageUrl: string | null;
      _count: { posts: number };
    }[]
  >([]);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCollections = async () => {
    const raw = await getUserCollections();
    const formatted = raw.map((collection) => ({
      id: collection.id,
      name: collection.name,
      previewImageUrl: collection.previewImage,
      _count: { posts: collection.postCount },
    }));
    setCollections(formatted);
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleAdd = async (collectionId: string) => {
    setLoading(true);
    setError("");
    const result = await addPostToCollection(postId, collectionId);

    // If the post is already in the collection
    if (!result.success) {
      setError("This post is already in the collection.");
    } else {
      onClose();
    }
    setLoading(false);
  };

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) return;
    setLoading(true);
    setError("");
    const result = await createCollection(newCollectionName, postId); // postId as preview
    if (result.success) {
      setNewCollectionName("");
      fetchCollections(); // Reload the collections
    } else {
      setError("Could not create the collection.");
    }
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white text-black p-6 rounded-xl shadow-xl w-[90%] max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
        >
          <X />
        </button>

        <h2 className="text-xl font-semibold mb-4">Add to Collection</h2>

        {/* Existing Collections */}
        <div className="mb-6 space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
          {collections.map((col) => (
            <div
              key={col.id}
              className="border px-4 py-2 rounded-lg flex justify-between items-center hover:bg-gray-100 transition cursor-pointer"
              onClick={() => handleAdd(col.id)}
            >
              <span>{col.name}</span>
              <span className="text-xs text-gray-400">
                {col._count.posts} photo(s)
              </span>
            </div>
          ))}
        </div>

        {/* New Collection */}
        <input
          type="text"
          placeholder="New collection name"
          value={newCollectionName}
          onChange={(e) => setNewCollectionName(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-2"
        />
        <button
          className="w-full bg-sky-500 text-white py-2 rounded hover:bg-sky-600 transition disabled:opacity-50"
          onClick={handleCreateCollection}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="animate-spin mx-auto" />
          ) : (
            "Create & Add"
          )}
        </button>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
}
