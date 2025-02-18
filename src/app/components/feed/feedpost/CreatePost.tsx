import { useState } from "react";
import { X, UploadCloud } from "lucide-react";

interface CreatePostProps {
  setShowAddPost: (value: boolean) => void;
}

export default function CreatePost({ setShowAddPost }: CreatePostProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Handle file selection (from input or drag & drop)
  const handleImageUpload = (file: File | null) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Handle input file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    handleImageUpload(file);
  };

  // Drag & Drop event handlers
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0] ?? null;
    handleImageUpload(file);
  };

  return (
<div
  className="z-[999] bg-black/50 h-full w-full fixed left-0 top-0 flex justify-center items-center overflow-y-auto"
  onClick={() => setShowAddPost(false)}
>
  <div
    className="bg-white p-6 rounded-lg shadow-lg w-[500px] max-w-full relative overflow-y-auto max-h-[90vh] custom-scrollbar scrollbar-gutter-stable"
    onClick={(e) => e.stopPropagation()}
  >
        {/* Close button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={() => setShowAddPost(false)}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4">Create a new post</h2>

        {/* Title Input */}
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          placeholder="Enter post title"
          className="w-full p-2 border rounded mb-4"
        />

        {/* Tags Input */}
        <label className="block text-sm font-medium">Tags</label>
        <input
          type="text"
          placeholder="Add tags (e.g. #Sky, #Nature)"
          className="w-full p-2 border rounded mb-4"
        />

        {/* Image Upload - Drag & Drop Area */}
        <label className="block text-sm font-medium mb-2">Upload Image</label>
        <div
          className={`flex flex-col items-center justify-center border-2 border-dashed p-6 rounded-lg cursor-pointer transition ${
            isDragging ? "border-sky-500 bg-sky-100" : "border-gray-300 hover:bg-gray-100"
          }`}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className="hidden"
            id="file-upload"
            accept="image/*"
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer">
            <UploadCloud size={32} className="text-gray-500 mb-2" />
            <span className="text-gray-600 text-sm">Click to upload or drag & drop</span>
          </label>
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="mt-4 relative">
            <img src={imagePreview} alt="Preview" className="w-full h-auto rounded-lg" />
            <button
              className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md text-gray-600 hover:text-red-500"
              onClick={() => setImagePreview(null)}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Submit Button */}
        <button className="bg-sky-500 text-white p-2 rounded w-full mt-4 hover:bg-sky-700 transition">
          Publish
        </button>
      </div>
    </div>
  );
}
