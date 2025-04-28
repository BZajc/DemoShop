"use server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function registerUser(formData: FormData) {
  const email = formData.get("email")?.toString().trim() || "";
  const password = formData.get("password")?.toString().trim() || "";
  const confirmPassword =
    formData.get("confirmPassword")?.toString().trim() || "";
  const name = formData.get("name")?.toString().trim() || "";

  const errors: Record<string, string> = {};

  // Email validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Invalid email format.";
  }

  // Password validation
  if (!password || password.length < 8 || password.length > 64) {
    errors.password = "Password must be between 8 and 64 characters long.";
  } else if (!/[A-Z]/.test(password) || !/\d/.test(password)) {
    errors.password =
      "Password must contain at least one uppercase letter and one number.";
  }

  // Confirm Password validation
  if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  // Username validation
  if (!name || name.length < 8 || name.length > 30) {
    errors.name = "Name must be between 8 and 30 characters long.";
  } else if (!/^[a-zA-Z0-9]+$/.test(name)) {
    errors.name = "Name can only contain letters and numbers.";
  }

  // If there are any errors, return them
  if (Object.values(errors).some((error) => error)) {
    return { errors };
  }

  // Check if email or username already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { name }],
    },
  });

  if (existingUser) {
    if (existingUser.email === email) {
      errors.email = "Email is already in use.";
    }
    if (existingUser.name === name) {
      errors.name = "Username is already taken.";
    }
    return { errors };
  }

  // Secure password by hashing it
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user in the database
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name },
  });

  return { success: true, user };
}
