
import { getUserCollections } from "@/app/api/actions/collections/getUserCollections";
import CollectionListClient from "@/app/components/collections/CollectionListClient";

export default async function CollectionsPage() {
  const collections = await getUserCollections();

  return (
    <div className="mt-[4rem] md:mt-0 max-w-5xl mx-auto p-6 animate-fade-in">

      <h1 className="text-2xl font-bold text-sky-900 mb-6">Your Collections</h1>

      <CollectionListClient initialCollections={collections} />
    </div>
  );
}
