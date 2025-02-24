"use server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { uploadUserProfileImage } from "@/lib/cloudinary";

export async function updateUserData(data: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  const userId = session.user.id;
  const realName = data.get("name") as string;
  const aboutMe = data.get("aboutMe") as string;
  const selectedTags = JSON.parse((data.get("selectedTags") as string) || "[]");
  const image = data.get("image") as File | null;

  let imageUrl = null;
  if (image && image.size > 0) {
    imageUrl = await uploadUserProfileImage(image);
  }

  try {
    await Promise.all(
      selectedTags.map(async (tagName: string) => {
        const existingTag = await prisma.tag.findUnique({
          where: { name: tagName },
        });
        if (!existingTag) {
          await prisma.tag.create({ data: { name: tagName } });
        }
      })
    );

    const existingTags = await prisma.tag.findMany({
      where: { name: { in: selectedTags } },
      select: { id: true, name: true },
    });

    await prisma.userTag.deleteMany({ where: { userId } });

    await prisma.userTag.createMany({
      data: existingTags.map((tag) => ({ userId, tagId: tag.id })),
    });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        realName,
        aboutMe,
        avatarPhoto: imageUrl,
      },
      include: {
        selectedTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    console.log(updatedUser.selectedTags);

    return {
      success: true,
      user: {
        ...updatedUser,
        selectedTags: updatedUser.selectedTags.map((ut) => ut.tag.name),
      },
    };
  } catch (error: any) {
    console.error("Error updating user data:", error);
    return {
      success: false,
      error: error.message || "Failed to update user data",
    };
  }
}
