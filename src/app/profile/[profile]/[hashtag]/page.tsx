import { auth } from "@/lib/auth";
import { House, Mail, UserPlus, Pencil } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import SearchHeader from "@/app/components/profile/SearchHeader";
import Image from "next/image";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ profile: string; hashtag: string }>;
}) {
  // Wait for params before use
  const resolvedParams = await params;
  console.log("Params:", JSON.stringify(resolvedParams, null, 2));

  // 404 if profile or hashtag doesnt exist
  if (!resolvedParams.profile || !resolvedParams.hashtag) {
    return notFound();
  }

  const user = await prisma.user.findUnique({
    where: {
      name_hashtag: {
        name: resolvedParams.profile,
        hashtag: resolvedParams.hashtag,
      },
    },
    select: {
      name: true,
      hashtag: true,
      avatarPhoto: true,
      createdAt: true,
      posts: { select: { id: true } },
      following: { select: { followingId: true } },
      followers: { select: { followerId: true } },
    },
  });

  if (!user) {
    return notFound();
  }

  const session = await auth();

  // Check if user is visiting his own profile
  const ownProfile =
    session?.user?.name === resolvedParams.profile &&
    session?.user?.hashtag === resolvedParams.hashtag;

  return (
    <div>
      {/* Go back button */}
      <nav className="bg-sky-600 flex items-center w-full">
        <div className="max-w-[1600px] w-full flex p-2 mx-auto justify-evenly">
          <Link
            href="/feed"
            className="text-white duration-300 transition-all hover:text-sky-400 p-1 mr-1"
          >
            <House size={38} />
          </Link>
          <SearchHeader />
          <div className="flex ml-auto">
            {ownProfile ? (
              <>
                <button className="mx-2 flex items-center p-2 rounded-full bg-stone-200 text-sky-900 transition-all duration-300 hover:bg-sky-200 hover:scale-[1.05]">
                  <Pencil className="mr-2" />
                  Edit your profile
                </button>
              </>
            ) : (
              <>
                <button className="mx-2 flex items-center p-2 rounded-full bg-stone-200 text-sky-900 transition-all duration-300 hover:bg-sky-200 hover:scale-[1.05]">
                  <Mail className="mr-2" />
                  Follow
                </button>
                <button className="mx-2 flex items-center p-2 rounded-full bg-stone-200 text-sky-900 transition-all duration-300 hover:bg-sky-200 hover:scale-[1.05]">
                  <UserPlus className="mr-2" />
                  Invite to contacts
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <header className="p-4 mx-auto max-w-[1600px]">
        <h1 className="text-2xl">
          {resolvedParams.profile}'s #{resolvedParams.hashtag} Profile
        </h1>
      </header>

      <section className="max-w-[1600px] flex p-4">
        <div className="w-[180px] h-[50px] relative">
          <Image
            src={user.avatarPhoto || "/images/profileMalePlaceholder.webp"}
            alt={`${user.name}'s profile picture`}
            height={180}
            width={180}
            className="rounded-full border-4 border-white"
          />
        </div>
        <div>
          <p>Username: {resolvedParams.profile}</p>
          <p>Real Name: John Doe</p>
          <p>Preferred Tags: #Test #Tags</p>
        </div>
      </section>
    </div>
  );
}
