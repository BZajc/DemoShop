"use server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function loginUser(formData: FormData) {
  const identifier = formData.get("identifier")?.toString().trim() || "";
  const password = formData.get("password")?.toString().trim() || "";

  const errors: Record<string, string> = {};

  // Checking inputs
  if (!identifier) {
    errors.identifier = "Email or username is required.";
  }
  if (!password) {
    errors.password = "Password is required.";
  }

  // If there are any errors, return them
  if (Object.keys(errors).length > 0) {
    return { errors, status: 400 };
  }

  // Find user by email or username
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { name: identifier }],
    },
  });

  if (!user) {
    return { errors: { identifier: "User with this email or username doesn't exist." }, status: 400 };
  }

  // Check Password
  if (!user.password) {
    return { errors: { password: "User doesn't have a password set." }, status: 400 };
  }
  
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return { errors: { password: "Incorrect Password" }, status: 400 };
  }

  return { success: true, email: user.email };
}
