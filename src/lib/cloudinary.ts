import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(image: File) {
  const arrayBuffer = await image.arrayBuffer();
  const base64String = Buffer.from(arrayBuffer).toString("base64");
  const fileUri = `data:${image.type};base64,${base64String}`;

  const result = await cloudinary.uploader.upload(fileUri, {
    folder: "user-avatars",
  });

  return result.secure_url;
}
