"use client";

import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useOptimistic, startTransition } from "react";
import { reactPost } from "@/app/api/actions/reactPost";
import { useRouter } from "next/navigation";

interface ReactionButtonsProps {
  postId: string;
  likes: number;
  dislikes: number;
  reactions: {
    reaction: string;
  }[];
}

type ReactionState = {
  likes: number;
  dislikes: number;
};

export default function ReactionButtons({
  postId,
  likes,
  dislikes,
  reactions,
}: ReactionButtonsProps) {
  const router = useRouter();

  const [optimisticReactions, setOptimisticReactions] = useOptimistic(
    { likes, dislikes } as ReactionState,
    (state: ReactionState, newReaction: Partial<ReactionState>) => ({
      ...state,
      ...newReaction,
    })
  );

  const handleReaction = (reactionType: "like" | "dislike") => {
    startTransition(() => {
      let newReaction: Partial<ReactionState> = {};

      if (reactionType === "like") {
        if (reactions.some((r) => r.reaction === "like")) {
          // Unlike if already liked
          newReaction = { likes: optimisticReactions.likes - 1 };
        } else {
          // Like or change from dislike to like
          newReaction = {
            likes: optimisticReactions.likes + 1,
            dislikes: reactions.some((r) => r.reaction === "dislike")
              ? optimisticReactions.dislikes - 1
              : optimisticReactions.dislikes,
          };
        }
      } else if (reactionType === "dislike") {
        if (reactions.some((r) => r.reaction === "dislike")) {
          // Undislike if already disliked
          newReaction = {
            dislikes: optimisticReactions.dislikes - 1,
          };
        } else {
          // Dislike or change from like to dislike
          newReaction = {
            dislikes: optimisticReactions.dislikes + 1,
            likes: reactions.some((r) => r.reaction === "like")
              ? optimisticReactions.likes - 1
              : optimisticReactions.likes,
          };
        }
      }

    //   Optimistic update
      setOptimisticReactions(newReaction);

      // Trigger Server Action
      reactPost(postId, reactionType).then(() => {
        // Refresh the data to sync with server
        router.refresh();
      });
    });
  };

  return (
    <div className="flex items-center">
      <button
        onClick={() => handleReaction("like")}
        className="flex p-1 duration-300 transition-all hover:text-sky-400"
      >
        {optimisticReactions.likes} <ThumbsUp className="mx-1" />
      </button>
      <button
        onClick={() => handleReaction("dislike")}
        className="flex p-1 ml-2 duration-300 transition-all hover:text-sky-400"
      >
        {optimisticReactions.dislikes} <ThumbsDown className="mx-1" />
      </button>
    </div>
  );
}
