import { Star, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import FeedCommentsCounter from "./FeedCommentsCounter";
import FeedCommentInput from "./FeedCommentInput";
import { Post } from "@/types/Post";
import ReactionButtons from "./ReactionButtons";
import FeedFollow from "./FeedFollow";
import PostOptionsMenu from "../../post/PostOptionsMenu";

interface FeedPostProps {
  post: Post;
}

export default function FeedPost({ post }: FeedPostProps) {
  const { id, imageUrl, title, user, userId, tags, createdAt, reactions } =
    post;
  const formattedDate = new Date(createdAt).toLocaleString();

  const likes = reactions.filter((r) => r.reaction === "like").length;
  const dislikes = reactions.filter((r) => r.reaction === "dislike").length;
  const totalReactions = likes + dislikes;
  const likePercentage =
    totalReactions > 0 ? Math.round((likes / totalReactions) * 100) : 0;

  return (
    <div
      className="relative w-full max-w-full mb-8 rounded-xl flex flex-col text-white"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-lg rounded-xl"></div>

      <div className="relative z-10 p-4">
        <div className="flex justify-between">
          <div className="flex items-center text-sm">
            <p>Published {formattedDate}</p>
            <FeedFollow userId={userId} />
          </div>
          <PostOptionsMenu
            authorId={userId}
            postId={id}
            postTitle={title}
            currentTags={tags.map(({ tag }) => tag.name)}
          />
        </div>

        <div className="flex mt-4 items-center">
          <Link
            className="w-[40px] h-[40px] overflow-hidden rounded-full hover:scale-[1.1] transition-all duration-300 relative"
            href={`/profile/${user.name}/${user.hashtag}`}
          >
            {user.avatarPhoto ? (
              <Image
                src={user.avatarPhoto}
                fill
                className="object-cover"
                alt={`${user.name} avatar`}
              />
            ) : (
              <div className="w-[40px] h-[40px] rounded-full bg-gray-300 flex items-center justify-center">
                <User size={24} className="text-gray-500" />
              </div>
            )}
          </Link>
          <div className="ml-4 text-sm">
            <Link
              href={`/profile/${user.name}/${user.hashtag}`}
              className="duration-300 transition-all hover:text-sky-400"
            >
              <p>@{user.name}</p>
            </Link>
            <p className="italic">{user.realName || ""}</p>
          </div>
        </div>

        <div className="w-[90%] border-b-2 border-white mx-auto mt-4 mb-2"></div>

        <div className="flex flex-wrap gap-2 ml-4">
          {tags.map(({ tag }) => (
            <Link
              key={tag.name}
              href={`/search?query=${encodeURIComponent(tag.name)}`}
              className="duration-300 transition-all hover:text-sky-400"
            >
              {tag.name}
            </Link>
          ))}
        </div>

        <div className="relative w-full h-[300px] mt-4">
          <Link href={`post/${id}`}>
            <Image
              src={imageUrl}
              fill
              className="object-cover rounded-lg"
              alt={`${title}`}
            />
          </Link>
        </div>

        <div className="flex m-2 justify-between items-center">
          <div className="flex m-2 items-center">
            <p className="flex mr-4">
              {likePercentage}% <Star className="ml-1" />
            </p>
            <ReactionButtons
              postId={id}
              likes={likes}
              dislikes={dislikes}
              reactions={reactions}
            />
          </div>
          <Link href={`post/${id}`}>
            <FeedCommentsCounter postId={id} />
          </Link>
        </div>

        <FeedCommentInput postId={id} />
      </div>
    </div>
  );
}
