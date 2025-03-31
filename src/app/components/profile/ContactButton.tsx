"use client";

import { useState, useTransition } from "react";
import { sendContactRequest } from "@/app/api/actions/contacts/sendContactRequest";
import { cancelContactRequest } from "@/app/api/actions/contacts/cancelContactRequest";
import { acceptContactRequest } from "@/app/api/actions/contacts/acceptContactRequest";
import { Loader2 } from "lucide-react";

type ContactStatusType = "none" | "invited" | "received" | "accepted";

export default function ContactButton({
  initialStatus,
  profileUserId,
}: {
  initialStatus: ContactStatusType;
  profileUserId: string;
}) {
  const [status, setStatus] = useState<ContactStatusType>(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    setIsLoading(true); // start manual loading
    const MIN_LOADING_TIME = 500;

    const start = Date.now();

    startTransition(async () => {
      try {
        if (status === "none") {
          await sendContactRequest(profileUserId);
          setStatus("invited");
        } else if (status === "invited") {
          await cancelContactRequest(profileUserId);
          setStatus("none");
        } else if (status === "received") {
          await acceptContactRequest(profileUserId);
          setStatus("accepted");
        } else if (status === "accepted") {
          console.log("Open chat");
        }
      } catch (err) {
        console.error("Error in contact action:", err);
      } finally {
        const elapsed = Date.now() - start;
        const remaining = MIN_LOADING_TIME - elapsed;

        setTimeout(() => {
          setIsLoading(false);
        }, remaining > 0 ? remaining : 0);
      }
    });
  };

  let label: React.ReactNode = "";

  if (isLoading) {
    label = <Loader2 className="w-4 h-4 animate-spin" />;
  } else {
    if (status === "none") label = "Invite";
    else if (status === "invited") label = "Invited";
    else if (status === "received") label = "Accept Invite";
    else if (status === "accepted") label = "Message";
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending || isLoading}
      className={`px-4 py-2 rounded-full font-medium border transition-all ${
        status === "invited" || status === "received"
          ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
          : status === "accepted"
          ? "bg-blue-500 text-white hover:bg-blue-600"
          : "bg-green-500 text-white hover:bg-green-600"
      }`}
    >
      {label}
    </button>
  );
}
