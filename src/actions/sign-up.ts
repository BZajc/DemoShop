"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;

  const { data: signUpData, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error || !signUpData.user?.id) {
    return { error: error?.message || "Signup failed." };
  }

  const userId = signUpData.user.id;

  try {
    await prisma.profiles.create({
      data: {
        id: userId,
        email,
        username,
      },
    });
  } catch (err) {
    console.error("Error creating profile:", err);
    throw new Error("Failed to create profile");
  }

  revalidatePath("/home", "layout");
  redirect("/home");
}
