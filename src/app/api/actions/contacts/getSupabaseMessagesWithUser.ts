"use client";

import { supabase } from "@/lib/supabaseClient";

type GetMessagesParams = {
  contactUserId: string;
  myUserId: string;
  page?: number; // default 0
  limit?: number; // default 10
};

export const getSupabaseMessagesWithUser = async ({
  contactUserId,
  myUserId,
  page = 0,
  limit = 10,
}: GetMessagesParams) => {
  const start = page * limit;
  const end = start + limit - 1;

  const { data, error } = await supabase
    .from("Message")
    .select("*")
    .or(`sender_id.eq.${myUserId},receiver_id.eq.${myUserId}`)
    .or(`sender_id.eq.${contactUserId},receiver_id.eq.${contactUserId}`)
    .order("created_at", { ascending: false }) // Newest from the start
    .range(start, end);

  if (error) {
    console.error("[SUPABASE_GET_MESSAGES_ERROR]", error.message);
    return [];
  }

  return data.reverse(); // reverse to display newest messages at the bottom of UI
};
