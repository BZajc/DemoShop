import { EllipsisVertical, Star, ThumbsUp, ThumbsDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import FeedCommentsCounter from "./FeedCommentsCounter";
import FeedCommentInput from "./FeedCommentInput";

export default function FeedPost() {
  const imageUrl = "/images/loremPicture4.jpg";

  return (
    <div
      className="relative m-4 rounded-xl flex flex-col text-white"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-lg rounded-xl"></div>

      <div className="relative z-10 p-4">
        {/* Post Header */}
        <div className="flex justify-between">
          <div className="flex items-center text-sm">
            <p>Published 01.01.25 at 17:28</p>
            <p className="mx-2">·</p>
            <button className="hover:text-sky-400 transition-all duration-300">
              Follow
            </button>
          </div>
          <button className="hover:text-sky-400 duration-300 transition-all">
            <EllipsisVertical />
          </button>
        </div>

        {/* Post data */}
        <div className="flex mt-4 items-center">
          <Link
            className="w-[40px] h-[40px] overflow-hidden rounded-full hover:scale-[1.1] transition-all duration-300 relative"
            href={""}
          >
            <Image
              src={imageUrl}
              fill
              className="object-cover"
              alt="temporary alt"
            />
          </Link>
          <div className="ml-4 text-sm">
            <Link
              href={""}
              className="duration-300 transition-all hover:text-sky-400"
            >
              @PicbookNickname
            </Link>
            <p>John Doe</p>
          </div>
        </div>

        <div className="w-[90%] border-b-2 border-white mx-auto mt-4 mb-2"></div>

        {/* Tags */}
        <div className="flex gap-2 ml-4">
          <Link
            href={""}
            className="duration-300 transition-all hover:text-sky-400"
          >
            #Sun
          </Link>
          <Link
            href={""}
            className="duration-300 transition-all hover:text-sky-400"
          >
            #Nature
          </Link>
          <Link
            href={""}
            className="duration-300 transition-all hover:text-sky-400"
          >
            #Sunshafts
          </Link>
          <Link
            href={""}
            className="duration-300 transition-all hover:text-sky-400"
          >
            #Yellow
          </Link>
          <Link
            href={""}
            className="duration-300 transition-all hover:text-sky-400"
          >
            #Water
          </Link>
        </div>

        {/* Post Picture */}
        <div className="relative w-full h-[300px] mt-4">
          <Image
            src={imageUrl}
            fill
            className="object-cover rounded-lg"
            alt="temporary alt"
          />
        </div>

        {/* Post Rating */}
        <div className="flex m-2 justify-between items-center">
          <div className="flex m-2 items-center">
            <p className="flex mr-4">
              87.50% <Star className="ml-1" />
            </p>
            <button className="flex p-1 duration-300 transition-all hover:text-sky-400">
              7 <ThumbsUp className="mx-1" />
            </button>
            <button className="flex p-1 ml-2 duration-300 transition-all hover:text-sky-400">
              1 <ThumbsDown className="mx-1" />
            </button>
          </div>

          {/* Show comments button and comments counter */}
          <FeedCommentsCounter />
        </div>
        <FeedCommentInput />
      </div>
    </div>
  );
}
