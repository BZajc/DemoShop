import Image from "next/image";
import {
  MessageCircle,
  Bell,
  Settings,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default function FeedSidebar() {
  return (
    <div className="w-1/5 min-w-[220px] max-w-[300px] flex flex-col mt-4 mx-2 sticky top-4 right-0 h-screen">
      {/* Quick Menu */}
      <div className="flex items-center justify-between  rounded-full bg-sky-900">
        <div className="flex items-center">
          <button className="rounded-full transition-all duration-300 hover:scale-[1.1] relative w-[35px] h-[35px] p-2 m-2">
            <Image
              src="/images/loremPicture1.jpg"
              alt="user picture"
              className="rounded-full object-cover"
              fill
            />
          </button>
        </div>
        <div className="mr-2">
          <button className="p-2 rounded-full mx-1 text-sky-200 transition-all duration-300 hover:bg-sky-700 hover:text-white">
            <MessageCircle strokeWidth={1.5} />
          </button>
          <button className="p-2 rounded-full mx-1 text-sky-200 transition-all duration-300 hover:bg-sky-700 hover:text-white">
            <Bell strokeWidth={1.5} />
          </button>
          <button className="p-2 rounded-full mx-1 text-sky-200 transition-all duration-300 hover:bg-sky-700 hover:text-white">
            <Settings strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Suggestions */}
      <div className="text-white bg-sky-900 p-2 mt-2 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm">Authors Suggestions</h4>
          <button className="text-sm p-1">See All</button>
        </div>

        {/* Users Container */}
        <button className="flex flex-col duration-300 transition-all hover:text-sky-400 w-full py-1 my-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative w-[35px] h-[35px] mx-2 mb-1">
                <Image
                  src="/images/loremPicture1.jpg"
                  alt="user picture"
                  className="rounded-full object-cover"
                  fill
                />
              </div>
              <div className="text-xs text-left">
                <p>Author Nickname</p>
                <p>Author Real Name</p>
              </div>
            </div>
            <div>
              <ArrowUpRight />
            </div>
          </div>
          <ul className="text-xs flex gap-1">
            <li>#Horror</li>
            <li>#Cosplay</li>
            <li>#Winter</li>
            <li>#Green</li>
          </ul>
        </button>
        <button className="flex flex-col duration-300 transition-all hover:text-sky-400 w-full py-1 my-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative w-[35px] h-[35px] mx-2 mb-1">
                <Image
                  src="/images/loremPicture1.jpg"
                  alt="user picture"
                  className="rounded-full object-cover"
                  fill
                />
              </div>
              <div className="text-xs text-left">
                <p>Author Nickname</p>
                <p>Author Real Name</p>
              </div>
            </div>
            <div>
              <ArrowUpRight />
            </div>
          </div>
          <ul className="text-xs flex gap-1">
            <li>#Horror</li>
            <li>#Cosplay</li>
            <li>#Winter</li>
            <li>#Green</li>
          </ul>
        </button>
        <button className="flex flex-col duration-300 transition-all hover:text-sky-400 w-full py-1 my-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative w-[35px] h-[35px] mx-2 mb-1">
                <Image
                  src="/images/loremPicture1.jpg"
                  alt="user picture"
                  className="rounded-full object-cover"
                  fill
                />
              </div>
              <div className="text-xs text-left">
                <p>Author Nickname</p>
                <p>Author Real Name</p>
              </div>
            </div>
            <div>
              <ArrowUpRight />
            </div>
          </div>
          <ul className="text-xs flex gap-1">
            <li>#Horror</li>
            <li>#Cosplay</li>
            <li>#Winter</li>
            <li>#Green</li>
          </ul>
        </button>
      </div>

      {/* Notifications */}
      <div className="text-white bg-sky-900 p-2 mt-2 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm">Notifications</h4>
          <button className="text-sm p-1">See All</button>
        </div>

        {/* Notifications Container */}
        <Link
          href={""}
          className="flex flex-col duration-300 transition-all hover:text-sky-400 w-full py-1 my-1 mx-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center">
              <div className="relative min-w-[35px] min-h-[35px]">
                <Image
                  src="/images/loremPicture1.jpg"
                  alt="user picture"
                  className="rounded-full object-cover w-[35px]"
                  fill
                />
              </div>
              <div className="text-xs text-left px-2">
                <p className="flex items-center">
                  <Clock size={12} className="mr-1" /> 4 minutes ago
                </p>
                <p>John Doe and 2 more sent you a message</p>
              </div>
            </div>
          </div>
        </Link>
        <Link
          href={""}
          className="flex flex-col duration-300 transition-all hover:text-sky-400 w-full py-1 my-1 mx-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center">
              <div className="relative min-w-[35px] min-h-[35px]">
                <Image
                  src="/images/loremPicture1.jpg"
                  alt="user picture"
                  className="rounded-full object-cover w-[35px]"
                  fill
                />
              </div>
              <div className="text-xs text-left px-2">
                <p className="flex items-center">
                  <Clock size={12} className="mr-1" /> 3 hours ago
                </p>
                <p>John Doe and 7 more invited you to contacts</p>
              </div>
            </div>
          </div>
        </Link>
        <Link
          href={""}
          className="flex flex-col duration-300 transition-all hover:text-sky-400 w-full py-1 my-1 mx-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center">
              <div className="relative min-w-[35px] min-h-[35px]">
                <Image
                  src="/images/loremPicture1.jpg"
                  alt="user picture"
                  className="rounded-full object-cover w-[35px]"
                  fill
                />
              </div>
              <div className="text-xs text-left px-2">
                <p className="flex items-center">
                  <Clock size={12} className="mr-1" /> 11 days ago
                </p>
                <p>John Doe and 29 more liked your picture</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
