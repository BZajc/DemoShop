"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Loader2, X } from "lucide-react";
import { deleteCollection } from "@/app/api/actions/collections/deleteCollection";
import { hideCollectionTagWarning } from "@/app/api/actions/collections/hideCollectionTagWarning";

interface Collection {
  id: string;
  name: string;
  previewImage: string | null;
  postCount: number;
  hideTagWarning?: boolean;
}

export default function CollectionListClient({
  initialCollections,
}: {
  initialCollections: Collection[];
}) {
  const [collections, setCollections] = useState(initialCollections);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null); // id kolekcji do potwierdzenia

  const handleDelete = async (id: string) => {
    setLoadingId(id);
    const result = await deleteCollection(id);
    setLoadingId(null);
    setConfirmId(null);

    if (result.success) {
      setCollections((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleHideWarning = async (collectionId: string) => {
    await hideCollectionTagWarning(collectionId);
    setCollections((prev) =>
      prev.map((c) =>
        c.id === collectionId ? { ...c, hideTagWarning: true } : c
      )
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {collections.map((collection) => {
          const showWarning = !collection.hideTagWarning;

          return (
            <div
              key={collection.id}
              className={`group border rounded-xl overflow-hidden shadow hover:shadow-lg transition bg-white relative ${
                showWarning ? "border-red-300" : ""
              }`}
            >
              {collection.previewImage ? (
                <div className="w-full h-48 relative">
                  <Image
                    src={collection.previewImage}
                    alt={collection.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
                  Empty Collection
                </div>
              )}

              <div className="p-4 relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="text-lg font-semibold text-sky-900 group-hover:underline">
                      {collection.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {collection.postCount} photo
                      {collection.postCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setConfirmId(collection.id); // zamiast usuwać – otwieramy modal
                    }}
                    className="text-red-600 hover:text-red-800 transition z-10 relative"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {showWarning && (
                  <div className="mt-4 p-3 border border-red-300 bg-red-50 text-red-600 rounded text-sm">
                    <p className="mb-2 font-semibold">No tags assigned</p>
                    <p className="text-xs">
                      Collections without tags may be harder to discover in
                      search results.
                    </p>
                    <label className="flex items-center gap-2 mt-2 text-xs text-red-800 cursor-pointer z-20 relative">
                      <input
                        type="checkbox"
                        className="accent-red-500"
                        onClick={(e) => e.stopPropagation()}
                        onChange={async () =>
                          await handleHideWarning(collection.id)
                        }
                      />
                      I understand, hide this message.
                    </label>
                  </div>
                )}
              </div>

              <Link
                href={`/collections/${collection.id}`}
                className="absolute inset-0 z-0"
                tabIndex={-1}
                aria-hidden="true"
              />
            </div>
          );
        })}
      </div>

      {/* Modal potwierdzenia usunięcia */}
      {confirmId && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={() => setConfirmId(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center relative"
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              onClick={() => setConfirmId(null)}
            >
              <X size={18} />
            </button>
            <h2 className="text-lg font-semibold text-sky-900 mb-4">
              Delete this collection?
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to permanently delete this collection?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmId(null)}
                className="px-4 py-2 rounded text-sm bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmId)}
                disabled={loadingId === confirmId}
                className="px-4 py-2 rounded text-sm bg-red-600 text-white hover:bg-red-700 transition"
              >
                {loadingId === confirmId ? (
                  <Loader2 className="animate-spin mx-auto" size={18} />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
