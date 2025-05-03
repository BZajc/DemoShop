import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Star, User } from "lucide-react";
import Link from "next/link";
import PostImageModal from "@/app/components/post/PostImageModal";
import ReactionButtons from "@/app/components/feed/feedpost/ReactionButtons";
import Comments from "@/app/components/post/Comments";
import SearchHeaderWithPublishButton from "@/app/components/other/SearchHeaderWithPublishButton";
import PostOptionsMenu from "@/app/components/post/PostOptionsMenu";
import FeedFollow from "@/app/components/feed/feedpost/FeedFollow";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          hashtag: true,
          realName: true,
          avatarPhoto: true,
        },
      },
      comments: {
        include: {
          user: {
            select: {
              name: true,
              avatarPhoto: true,
            },
          },
        },
      },
      tags: { include: { tag: true } },
      reactions: true,
    },
  });

  if (!post) return notFound();

  const likes = post.reactions.filter((r) => r.reaction === "like").length;
  const dislikes = post.reactions.filter(
    (r) => r.reaction === "dislike"
  ).length;
  const total = likes + dislikes;
  const rating = total ? Math.round((likes / total) * 100) : 0;
  const formattedDate = new Date(post.createdAt).toLocaleString();

  return (
    <div className="max-w-[100vw] md:max-w-4xl mx-auto mt-16 md:mt-4 p-6 text-white animate-fade-in flex flex-col">
      <header>
        <SearchHeaderWithPublishButton />
        <h1 className="text-black text-2xl py-2">{post.title}</h1>
      </header>
      <div
        className="relative rounded-xl p-4 mt-2"
        style={{
          backgroundImage: `url(${post.imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-lg rounded-xl"></div>
        <div className="relative z-10 max-w-[100vw]">
          {/* Post Container */}
          <div className="flex justify-between text-sm items-center">
            <div className="flex items-center gap-2">
              <p>Published {formattedDate}</p>
              <FeedFollow userId={post.user.id} />
            </div>
            <PostOptionsMenu
              authorId={post.user.id}
              postId={post.id}
              postTitle={post.title}
              currentTags={post.tags.map(({ tag }) => tag.name)}
            />
          </div>

          {/* Author Info */}
          <div className="flex mt-4 items-center">
            <Link
              href={`/profile/${post.user.name}/${post.user.hashtag}`}
              className="w-[40px] h-[40px] overflow-hidden rounded-full hover:scale-[1.1] transition-all duration-300 relative"
            >
              {post.user.avatarPhoto ? (
                <Image
                  src={post.user.avatarPhoto}
                  fill
                  className="object-cover"
                  alt={`${post.user.name} avatar`}
                />
              ) : (
                <div className="w-[40px] h-[40px] rounded-full bg-gray-300 flex items-center justify-center">
                  <User size={24} className="text-gray-500" />
                </div>
              )}
            </Link>
            <div className="ml-4 text-sm">
              <Link
                href={`/profile/${post.user.name}/${post.user.hashtag}`}
                className="hover:text-sky-400 transition-all"
              >
                @{post.user.name}
              </Link>
              <p className="italic">{post.user.realName || ""}</p>
            </div>
          </div>

          <div className="w-[90%] border-b-2 border-white mx-auto mt-4 mb-2"></div>

          {/* Tags */}
          <div className="flex gap-2 ml-4 mb-4">
            {post.tags.map(({ tag }) => (
              <Link
                key={tag.name}
                href={`/search?query=${encodeURIComponent(tag.name)}`}
                className="hover:text-sky-400 transition-all"
              >
                {tag.name}
              </Link>
            ))}
          </div>

          {/* Main Image */}
          <PostImageModal src={post.imageUrl} alt={post.title} />

          {/* Rating + Reactions */}
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center">
              <p className="flex items-center mr-4">
                {rating}% <Star className="ml-1" />
              </p>
              <ReactionButtons
                postId={post.id}
                likes={likes}
                dislikes={dislikes}
                reactions={post.reactions}
              />
            </div>
          </div>

          {/* Comments */}
          <div className="mt-6">
            <Comments postId={post.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
