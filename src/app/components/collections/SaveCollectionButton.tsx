'use client';

import { saveCollection } from "@/app/api/actions/collections/saveCollection";
import { useRouter } from "next/navigation";

export default function SaveCollectionButton({ collectionId }: { collectionId: string }) {
  const router = useRouter();

  const handleSave = async () => {
    await saveCollection(collectionId);
    router.push("/collections");
  };

  return (
    <button
      onClick={handleSave}
      className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition text-sm"
    >
      Save collection
    </button>
  );
}
