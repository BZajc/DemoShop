import prisma from "@/lib/prisma";

interface FeedCommentsProps {
  postId: string;
}

export default async function FeedComments({ postId }: FeedCommentsProps) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { comments: true },
  });

  return (
    <div>
      <button className="flex hover:text-sky-400 duration-300 transition-all p-2">
        Comments
        <p className="mx-2">·</p>
        <p>{post?.comments.length ?? 0}</p>
      </button>
    </div>
  );
}
