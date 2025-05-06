import { auth } from "@/lib/auth"
import { House, User as UserIcon } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import SearchHeader from "@/app/components/profile/SearchHeader"
import Image from "next/image"
import TagsAsButtons from "@/app/components/profile/TagsAsButtons"
import { addRecentlyVisited } from "@/app/api/actions/userData/addRecentlyVisited"
import UserPosts from "@/app/components/profile/UserPosts"
import EditProfileModalLauncher from "@/app/components/profile/EditProfileModalLauncher"
import ContactButton from "@/app/components/profile/ContactButton"
import { getContactStatus } from "@/app/api/actions/contacts/getContactStatus"
import FollowButton from "@/app/components/profile/FollowButton"
import { isFollowing } from "@/app/api/actions/follows/isFollowing"
import { isUserOnline } from "@/lib/isUserOnline"
import RemoveContactButton from "@/app/components/profile/RemoveContactButton"

type Props = {
  params: Promise<{
    profile: string
    hashtag: string
  }>
}

export default async function ProfilePage({ params }: Props) {
  const { profile, hashtag } = await params

  if (!profile || !hashtag) {
    return notFound()
  }

  const user = await prisma.user.findUnique({
    where: { name_hashtag: { name: profile, hashtag } },
    select: {
      id: true,
      name: true,
      hashtag: true,
      avatarPhoto: true,
      createdAt: true,
      realName: true,
      aboutMe: true,
      lastSeenAt: true,
      posts: { select: { id: true, title: true, imageUrl: true } },
      following: { select: { followingId: true } },
      followers: { select: { followerId: true } },
      selectedTags: { include: { tag: true } },
    },
  })

  if (!user) {
    return notFound()
  }

  await addRecentlyVisited(user.id)

  const session = await auth()
  const ownProfile =
    session?.user?.name === profile && session?.user?.hashtag === hashtag

  const contactStatus = await getContactStatus(user.id)
  const isUserFollowing = await isFollowing(user.id)
  const online = isUserOnline(user.lastSeenAt)

  return (
    <div className="p-4 animate-fade-in">
      <header className="flex items-center justify-between mt-4 mb-12 max-w-[1200px] mx-auto">
        <Link
          href="/feed"
          className="p-4 mr-4 duration-300 transition-all hover:scale-[1.05] bg-sky-400 text-white rounded-full border-2 border-sky-400 hover:text-sky-400 hover:bg-white flex items-center justify-center"
        >
          <House size={30} />
        </Link>
        <div className="w-[600px] max-w-[90%]">
          <SearchHeader />
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[1200px] mx-auto">
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-3xl shadow-lg p-4 flex flex-col items-center text-center">
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
                <UserIcon size={48} className="text-gray-500" />
              </div>
            )}
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-500">#{user.hashtag}</p>
            {user.realName && (
              <p className="text-gray-700 italic">{user.realName}</p>
            )}
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Profile Information</h2>
            <p className="text-gray-500">
              Joined: {new Date(user.createdAt).toLocaleDateString()}
            </p>
            <p className="text-gray-500">
              Followers: {user.followers.length}
            </p>
            <p className="text-gray-500">
              Following: {user.following.length}
            </p>
            <p className="text-gray-500">About Me: {user.aboutMe}</p>

            <div className="mt-4 flex gap-2 flex-wrap justify-center">
              {ownProfile ? (
                <EditProfileModalLauncher
                  initialData={{
                    name: user.name,
                    aboutMe: user.aboutMe || "",
                    selectedTags: user.selectedTags.map(
                      ({ tag }) => tag.name
                    ),
                    imageSrc: user.avatarPhoto || null,
                  }}
                />
              ) : (
                <>
                  <ContactButton
                    initialStatus={contactStatus}
                    profileUserId={user.id}
                    profileUserName={user.name}
                    profileUserHashtag={user.hashtag || ""}
                  />
                  <FollowButton
                    profileUserId={user.id}
                    initialIsFollowing={isUserFollowing}
                  />
                  {contactStatus === "accepted" && (
                    <RemoveContactButton userId={user.id} />
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-3xl shadow-lg p-4 overflow-y-auto max-h-[400px]">
            <h2 className="text-lg font-semibold mb-2">Interests</h2>
            <TagsAsButtons selectedTags={user.selectedTags} />
          </div>

          <UserPosts posts={user.posts} />
        </div>
      </section>
    </div>
  )
}
