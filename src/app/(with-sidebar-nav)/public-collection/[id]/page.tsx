import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import CollectionClient from "@/app/components/collections/CollectionClient";
import SaveCollectionButton from "@/app/components/collections/SaveCollectionButton";

type PublicCollectionPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PublicCollectionPage({ params }: PublicCollectionPageProps) {
  const { id } = await params;

  const session = await auth();
  const currentUserId = session?.user?.id;

  const collection = await prisma.collection.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, hashtag: true, realName: true },
      },
      posts: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          imageUrl: true,
          user: { select: { name: true, hashtag: true } },
        },
      },
    },
  });

  if (!collection || collection.posts.length === 0) return notFound();

  const isOwner = collection.user.id === currentUserId;

  return (
    <div className="max-w-5xl mx-auto p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-sky-900">{collection.name}</h1>
          {!isOwner && (
            <p className="text-sm text-gray-500">
              A public collection by{" "}
              <a
                href={`/profile/${collection.user.name}/${collection.user.hashtag}`}
                className="text-sky-700 font-medium hover:underline"
              >
                @{collection.user.name}
              </a>
            </p>
          )}
        </div>

        {!isOwner && <SaveCollectionButton collectionId={collection.id} />}
      </div>

      <CollectionClient
        collectionId={collection.id}
        collectionName={collection.name}
        initialPosts={collection.posts}
      />
    </div>
  );
}
