import { auth } from "@/lib/auth";
import { House, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import SearchHeader from "@/app/components/profile/SearchHeader";
import Image from "next/image";
import TagsAsButtons from "@/app/components/profile/TagsAsButtons";
import { addRecentlyVisited } from "@/app/api/actions/addRecentlyVisited";
import UserPosts from "@/app/components/profile/UserPosts";
import EditProfileModalLauncher from "@/app/components/profile/EditProfileModalLauncher";
import ContactButton from "@/app/components/profile/ContactButton";
import { getContactStatus } from "@/app/api/actions/contacts/getContactStatus";
import FollowButton from "@/app/components/profile/FollowButton";
import { isFollowing } from "@/app/api/actions/isFollowing";
import { isUserOnline } from "@/lib/isUserOnline";

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
      id: true,
      name: true,
      hashtag: true,
      avatarPhoto: true,
      createdAt: true,
      realName: true,
      aboutMe: true,
      lastSeenAt: true,
      posts: {
        select: {
          id: true,
          title: true,
          imageUrl: true,
        },
      },
      following: { select: { followingId: true } },
      followers: { select: { followerId: true } },
      selectedTags: {
        include: { tag: true },
      },
    },
  });

  if (!user) {
    return notFound();
  }

  // Add profile to recently visited
  await addRecentlyVisited(user.id);

  const session = await auth();

  // Check if user is visiting his own profile
  const ownProfile =
    session?.user?.name === resolvedParams.profile &&
    session?.user?.hashtag === resolvedParams.hashtag;

  // Handle what contact button should do
  const contactStatus = await getContactStatus(user.id);

  // Handle what follow button should do
  const isUserFollowing = await isFollowing(user.id);

  // is user online
  const online = isUserOnline(user.lastSeenAt);

  return (
    <div className="p-4 animate-fade-in">
      <header className="flex items-center mt-4 mb-12 max-w-[1200px] mx-auto">
        <Link
          href="/feed"
          className="p-4 mr-4 duration-300 transition-all hover:scale-[1.05] bg-sky-400 text-white rounded-full border-2 border-sky-400 hover:text-sky-400 hover:bg-white flex items-center justify-center"
        >
          <House size={30} />
        </Link>
        <SearchHeader />
      </header>

      <section className="grid grid-cols-2 gap-4 max-w-[1200px] mx-auto h-[800px]">
        {/* First Column */}
        <div className="h-full flex flex-col gap-4">
          {/* Left Top - Profile Info */}
          <div className="bg-white h-1/2 w-full rounded-3xl shadow-lg p-4 flex flex-col items-center justify-center text-center">
            {user.avatarPhoto ? (
              <div
                className={`w-[100px] h-[100px] rounded-full overflow-hidden mb-4 ${
                  online ? "ring-4 ring-green-500" : ""
                }`}
              >
                <Image
                  src={user.avatarPhoto}
                  alt={`${user.name}'s avatar`}
                  width={100}
                  height={100}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div
                className={`w-[100px] h-[100px] rounded-full bg-gray-300 flex items-center justify-center mb-4 ${
                  online ? "ring-4 ring-green-500" : ""
                }`}
              >
                <User size={48} className="text-gray-500" />
              </div>
            )}
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-500">#{user.hashtag}</p>
            {user.realName && (
              <p className="text-gray-700 italic">{user.realName}</p>
            )}
          </div>

          {/* Left Bottom - Actions and Stats */}
          <div className="bg-white h-1/2 w-full rounded-3xl shadow-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Profile Information</h2>
            <p className="text-gray-500">
              Joined: {new Date(user.createdAt).toLocaleDateString()}
            </p>
            <p className="text-gray-500">Followers: {user.followers.length}</p>
            <p className="text-gray-500">Following: {user.following.length}</p>
            <p className="text-gray-500">About Me: {user.aboutMe}</p>
            <div className="mt-4 flex gap-2">
              {ownProfile ? (
                <EditProfileModalLauncher
                  initialData={{
                    name: user.name || "",
                    aboutMe: user.aboutMe || "",
                    selectedTags: user.selectedTags.map(({ tag }) => tag.name),
                    imageSrc: user.avatarPhoto || null,
                  }}
                />
              ) : (
                <>
                  <ContactButton
                    profileUserId={user.id}
                    initialStatus={contactStatus}
                  />
                  <FollowButton
                    profileUserId={user.id}
                    initialIsFollowing={isUserFollowing}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Second Column */}
        <div className="h-full flex flex-col gap-4">
          {/* Right Top - Tags */}
          <div className="bg-white h-1/2 w-full rounded-3xl shadow-lg p-4 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-2">Interests</h2>
            <TagsAsButtons selectedTags={user.selectedTags} />
          </div>

          {/* Right Bottom - Posts */}
          <UserPosts posts={user.posts} />
        </div>
      </section>
    </div>
  );
}
