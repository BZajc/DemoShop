import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ContactProvider } from "@/app/context/ContactContext";
import ChatWindow from "@/app/components/contacts/ChatWindow";
import LeftPanel from "@/app/components/contacts/LeftPanel";
import Link from "next/link";
import { House } from "lucide-react";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ name: string; hashtag: string }>;
}) {
  const resolvedParams = await params;

  const session = await auth();
  if (!session?.user) return notFound();

  const user = await prisma.user.findUnique({
    where: {
      name_hashtag: {
        name: resolvedParams.name,
        hashtag: resolvedParams.hashtag,
      },
    },
    select: {
      id: true,
      name: true,
      hashtag: true,
      realName: true,
      avatarPhoto: true,
      lastSeenAt: true,
    },
  });

  if (!user || user.id === session.user.id) return notFound();

  return (
    <ContactProvider selectedUserId={user.id}>
      <div className="h-screen max-h-screen flex flex-col animate-fade-in">
        <header className="flex items-center p-4 border-b border-gray-200">
          <Link
            href="/feed"
            className="p-3 rounded-full bg-sky-400 text-white border-2 border-sky-400 hover:bg-white hover:text-sky-400 transition-all duration-300"
          >
            <House size={24} />
          </Link>
          <h1 className="ml-4 text-xl font-semibold text-sky-900">Contacts</h1>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <div className="hidden md:block w-1/3 bg-white border-r overflow-y-auto">
            <LeftPanel />
          </div>
          <div className="w-full md:w-2/3 bg-white overflow-y-auto">
            <ChatWindow
              contactUser={{
                ...user,
                hashtag: user.hashtag!,
                lastSeenAt: user.lastSeenAt
                  ? user.lastSeenAt.toISOString()
                  : null,
              }}
            />
          </div>
        </div>
      </div>
    </ContactProvider>
  );
}
