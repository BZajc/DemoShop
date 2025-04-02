"use client";
import { useState, useEffect } from "react";
import { X, UploadCloud, Loader2 } from "lucide-react";
import { createPost } from "@/app/api/actions/createPost";

interface CreatePostProps {
  setShowAddPost: (value: boolean) => void;
}

export default function CreatePost({ setShowAddPost }: CreatePostProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState({
    title: "",
    tags: "",
    image: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch tags from database and sort them alphabetically
  useEffect(() => {
    async function fetchTags() {
      try {
        const response = await fetch("/api/getTags");
        const data = await response.json();
        if (data.success) {
          const sortedTags = data.tags.sort((a: string, b: string) =>
            a.localeCompare(b)
          );
          setAvailableTags(sortedTags);
        }
      } catch (error) {
        console.error("Failed to load tags:", error);
      }
    }
    fetchTags();
  }, []);

  // Filter tags while typing
  useEffect(() => {
    const cleanedInput = tagInput.trim().replace(/^#+/, "");

    if (cleanedInput.length === 0) {
      setSuggestedTags([]);
      return;
    }

    const fetchTags = async () => {
      try {
        const response = await fetch(
          `/api/getTags?query=${encodeURIComponent(cleanedInput)}`
        );
        const data = await response.json();
        if (data.success) {
          const filtered = data.tags.filter(
            (tag: string) => !selectedTags.includes(tag)
          );
          setSuggestedTags(filtered);
        }
      } catch (error) {
        console.error("Error fetching filtered tags:", error);
      }
    };

    const delay = setTimeout(fetchTags, 200); // debounce

    return () => clearTimeout(delay);
  }, [tagInput, selectedTags]);

  const handleTagInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(event.target.value);
  };

  const handleTagInputFocus = () => {
    setIsFocused(true);
  };

  const handleTagInputBlur = () => {
    setTimeout(() => setIsFocused(false), 200); // Delay to allow click on suggestion
  };

  const handleTagSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setTagInput("");
    setSuggestedTags([]);
  };

  const handleTagRemove = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  // Handle file selection (from input or drag & drop)
  const handleImageUpload = (file: File | null) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);

      setImageFile(file);
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      image: "",
    }));
  };

  // Handle input file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    handleImageUpload(file);
  };

  const validatePost = () => {
    const newErrors = {
      title: "",
      tags: "",
      image: "",
    };
    let isValid = true;

    // Validate Title
    if (title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters long.";
      isValid = false;
    }

    // Validate Tags
    if (selectedTags.length === 0) {
      newErrors.tags = "Please select at least one tag.";
      isValid = false;
    }

    // Validate Image
    if (!imagePreview) {
      newErrors.image = "Please upload an image.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePublish = async () => {
    if (validatePost()) {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("tags", JSON.stringify(selectedTags));

      if (imageFile) {
        formData.append("image", imageFile);
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          image: "Please upload an image.",
        }));
        setIsSubmitting(false);
        return;
      }

      try {
        const result = await createPost(formData);

        if (result.success) {
          setShowSuccess(true); // Set success state to change button text

          setTimeout(() => {
            setShowSuccess(false);
            setShowAddPost(false);
          }, 2000);
        } else {
          console.error("Failed to create post:", result.error);
        }
      } catch (error) {
        console.error("Error creating post:", error);
      }

      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="custom-scrollbar scrollbar-gutter-stable animate-fade-in z-[999] bg-black/50 h-full w-full fixed left-0 top-0 flex justify-center items-center overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) setShowConfirmPopup(true);
      }}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-[500px] max-w-full relative overflow-y-auto max-h-[90vh] custom-scrollbar scrollbar-gutter-stable"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={() => setShowConfirmPopup(true)}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-black">Create a new post</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handlePublish();
          }}
          className="text-black relative"
        >
          {/* Title Input */}
          <label htmlFor="title" className="block text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Enter post title"
            className="w-full p-2 border rounded mb-4"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title}</p>
          )}

          {/* Tags Input */}
          <label htmlFor="tags" className="block text-sm font-medium">
            Tags
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            placeholder="Add tags (e.g. #Sky, #Nature)"
            value={tagInput}
            autoComplete="off"
            onChange={handleTagInputChange}
            onFocus={handleTagInputFocus}
            onBlur={handleTagInputBlur}
            className="w-full p-2 border rounded mb-4"
          />
          {errors.tags && <p className="text-red-500 text-sm">{errors.tags}</p>}

          {/* List of suggested tags */}
          {isFocused && suggestedTags.length > 0 && (
            <ul className="custom-scrollbar scrollbar-gutter-stable select-none absolute right-0 bg-white border border-sky-400 rounded-md mt-1 p-2 shadow-lg z-50 max-h-60 w-full overflow-y-auto">
              {suggestedTags.map((tag) => (
                <li
                  key={tag}
                  onClick={() => handleTagSelect(tag)}
                  className="p-2 hover:bg-sky-100 cursor-pointer text-sky-700 rounded-md transition-colors"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}

          {/* List of chosen tags */}
          <div className="mt-4 mb-12 flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="select-none bg-sky-200 text-sky-900 px-3 py-1 rounded-full cursor-pointer hover:bg-sky-300 flex items-center"
                onClick={() => handleTagRemove(tag)}
              >
                {tag} <X className="ml-2" />
              </span>
            ))}
          </div>

          {/* Image Upload - Drag & Drop Area */}
          <label
            htmlFor="file-upload"
            className={`flex flex-col items-center justify-center border-2 border-dashed p-6 rounded-lg cursor-pointer transition ${
              isDragging
                ? "border-sky-500 bg-sky-100"
                : "border-gray-300 hover:bg-gray-100"
            }`}
            onDragOver={(e: React.DragEvent<HTMLLabelElement>) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragEnter={(e: React.DragEvent<HTMLLabelElement>) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e: React.DragEvent<HTMLLabelElement>) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files[0] ?? null;
              handleImageUpload(file);
            }}
          >
            <input
              type="file"
              name="image"
              className="hidden"
              id="file-upload"
              accept="image/*"
              onChange={handleFileChange}
            />
            <UploadCloud size={32} className="text-gray-500 mb-2" />
            <span className="text-gray-600 text-sm">
              Click to upload or drag & drop
            </span>
            <span className="text-gray-600 text-sm">Max image size 2mb</span>
          </label>

          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image}</p>
          )}

          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-4 relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-auto rounded-lg"
              />
              <button
                className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md text-gray-600 hover:text-red-500"
                onClick={() => setImagePreview(null)}
              >
                <X size={16} />
              </button>
            </div>
          )}
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || showSuccess}
            className={`p-2 rounded w-full mt-4 transition font-semibold ${
              isSubmitting
                ? "bg-sky-500 text-white opacity-50 cursor-not-allowed"
                : showSuccess
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-sky-500 text-white hover:bg-sky-700"
            }`}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin mx-auto" size={24} />
            ) : showSuccess ? (
              "✔ Published!"
            ) : (
              "Publish"
            )}
          </button>
        </form>
      </div>

      {/* Confirm Popup to close modal */}
      {showConfirmPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-[1000]">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-[400px]">
            <h3 className="text-lg font-semibold text-gray-900">
              Are you sure?
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Your changes will not be saved if you close now.
            </p>

            <div className="flex justify-center gap-4 mt-4">
              <button
                className="bg-gray-300 text-gray-900 py-2 px-4 rounded-full transition hover:bg-gray-400"
                onClick={() => setShowConfirmPopup(false)}
              >
                No, go back
              </button>

              <button
                className="bg-red-500 text-white py-2 px-4 rounded-full transition hover:bg-red-600"
                onClick={() => setShowAddPost(false)}
              >
                Yes, close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
