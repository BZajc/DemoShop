import { supabase } from "@/lib/supabaseClient";

export const sendSupabaseMessage = async (
  receiverId: string,
  content: string,
  senderId: string
) => {
  const { data, error } = await supabase.from("Message").insert([
    {
      sender_id: senderId,
      receiver_id: receiverId,
      content: content,
    },
  ]);

  if (error) {
    console.error("[SUPABASE_SEND_MESSAGE_ERROR]", error.message);
    return null;
  }

  return data?.[0];
};
