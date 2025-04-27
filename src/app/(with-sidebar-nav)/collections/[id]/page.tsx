import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import CollectionClient from "@/app/components/collections/CollectionClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import CollectionTagManager from "@/app/components/collections/CollectionTagManager";
import Link from "next/link";

interface CollectionPageProps {
  params: {
    id: string;
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { id } = params;

  const session = await getServerSession(authOptions);

  const collection = await prisma.collection.findUnique({
    where: { id },
    include: {
      user: true,
      posts: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          imageUrl: true,
          user: {
            select: {
              name: true,
              hashtag: true,
            },
          },
        },
      },
    },
  });

  if (!collection) return notFound();

  const isOwner = session?.user?.id === collection.userId;

  return (
    <>
      {isOwner && (
        <div className="max-w-5xl mx-auto p-6 pt-0">
          <Link
            href="/collections"
            className="inline-block mb-6 px-4 py-2 bg-sky-500 text-white text-sm font-medium rounded-full hover:bg-sky-600 transition"
          >
            ← Back to collections
          </Link>

          <CollectionTagManager collectionId={collection.id} />
        </div>
      )}

      <CollectionClient
        collectionId={collection.id}
        collectionName={collection.name}
        initialPosts={collection.posts}
      />
    </>
  );
}
