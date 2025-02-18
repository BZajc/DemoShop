"use client";
import { useState, useEffect } from "react";
import { UserData } from "./FirstTimeData";

interface FirstModalProps {
  userData: UserData;
  handleDataChange: (data: UserData) => void;
}

export default function FirstModal({
  userData,
  handleDataChange,
}: FirstModalProps) {
  const [tagInput, setTagInput] = useState("");
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false); // Control input focus
  const [availableTags, setAvailableTags] = useState<string[]>([]);

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

  // Show sorted tags on focus and filter while typing
  useEffect(() => {
    if (tagInput.trim().length > 0) {
      // Remove leading '#' characters from user input
      const cleanedInput = tagInput.trim().replace(/^#+/, "");

      const filteredTags = availableTags
        .filter(
          (tag) =>
            // Remove leading '#' from available tags and check if they start with the cleaned input
            tag
              .replace(/^#+/, "")
              .toLowerCase()
              .startsWith(cleanedInput.toLowerCase()) &&
            // Ensure the tag is not already selected by the user
            !userData.selectedTags?.includes(tag)
        )
        // Sort the filtered tags alphabetically
        .sort((a, b) => a.localeCompare(b));
      setSuggestedTags(filteredTags);
    } else {
      // If input is empty show all available tags (excluding selected ones) sorted alphabetically
      setSuggestedTags(
        availableTags
          .filter((tag) => !userData.selectedTags?.includes(tag))
          .sort((a, b) => a.localeCompare(b))
      );
    }
  }, [tagInput, isFocused, userData.selectedTags, availableTags]);

  // Add tag to the selected list
  const handleTagSelect = (tag: string) => {
    if (!userData.selectedTags?.includes(tag)) {
      handleDataChange({
        ...userData,
        selectedTags: [...(userData.selectedTags || []), tag],
      });
    }
  };

  // Handle Enter key event
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!tagInput.trim()) return;
  
      // Remove unnecessary "#"
      const cleanedTag = tagInput.trim().replace(/^#+/, "");
  
      if (cleanedTag.length > 20) {
        setErrorMessage("❌ Tag can have a maximum of 20 characters.");
        return;
      }
  
      if (!cleanedTag) {
        setErrorMessage("❌ The tag must contain at least one valid character.");
        return;
      }
  
      // Ensure the tag exists in the available tags list
      const matchingTag = availableTags.find(
        (tag) => tag.replace(/^#+/, "").toLowerCase() === cleanedTag.toLowerCase()
      );
  
      if (!matchingTag) {
        setErrorMessage("❌ This tag does not exist in the available list.");
        return;
      }
  
      // Add the tag if not already selected
      if (!userData.selectedTags?.includes(matchingTag)) {
        handleDataChange({
          ...userData,
          selectedTags: [...(userData.selectedTags || []), matchingTag],
        });
      }
  
      // Clear input and reset suggestions
      setTagInput("");
      setSuggestedTags([]);
      setErrorMessage("");
    }
  };
  

  // Remove tag from the list
  const handleTagRemove = (tag: string) => {
    handleDataChange({
      ...userData,
      selectedTags: userData.selectedTags?.filter((t) => t !== tag) || [],
    });
  };

  return (
    <>
      <h2 className="text-xl text-sky-950">
        Hey, it looks like you're visiting Picbook for the first time!
      </h2>
      <p>
        Start by personalizing your preferences and providing some basic
        information about yourself and your interests.
      </p>

      <div className="w-full mt-4">
        <form className="flex flex-col text-start relative">
          {/* Name */}
          <label htmlFor="realname">🕵🏻‍♀️ What's your real name?</label>
          <input
            type="text"
            name="realname"
            placeholder="Name and surname"
            className="border-b-2 border-sky-400 mb-2 outline-none focus:bg-sky-200 transition-colors p-1 w-full"
            value={userData.name || ""}
            maxLength={64}
            onChange={(e) =>
              handleDataChange({
                ...userData,
                name: e.target.value.slice(0, 64),
              })
            }
          />
          <p className="text-sm text-gray-500 mb-2">
            {userData.name?.length || 0}/64 characters
          </p>

          {/* About Me */}
          <label htmlFor="aboutme">❓ Say something about yourself</label>
          <textarea
            name="aboutme"
            placeholder="What do you like to do? Your hobbies? What are you looking for on Picbook?"
            className="border-b-2 border-sky-400 max-h-[300px] mb-2 outline-none focus:bg-sky-200 transition-colors p-1 w-full"
            value={userData.aboutMe || ""}
            maxLength={2000}
            onChange={(e) =>
              handleDataChange({
                ...userData,
                aboutMe: e.target.value.slice(0, 2000),
              })
            }
          />
          <p className="text-sm text-gray-500 mb-2">
            {userData.aboutMe?.length || 0}/2000 characters
          </p>

          {/* Preferred tags */}
          <label htmlFor="tags">❤️ What are your preferred tags?</label>

          <input
            type="text"
            name="tags"
            placeholder="Type a tag (e.g. #Sky, #Sun)..."
            value={tagInput}
            autoComplete="off"
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            className="border-b-2 border-sky-400 outline-none focus:bg-sky-200 transition-colors p-1 w-full"
          />

          {/* Error Info */}
          {errorMessage && (
            <p className="text-rose-600 text-sm mt-1">{errorMessage}</p>
          )}

          {/* List of suggested tags */}
          {isFocused && suggestedTags.length > 0 && (
            <div className="absolute right-0 bg-white border border-sky-400 w-[50%] rounded-lg mt-1 p-2 shadow-lg z-50 max-h-[300px] overflow-y-auto">
              {suggestedTags.map((tag) => (
                <div
                  key={tag}
                  className="p-2 hover:bg-sky-100 cursor-pointer text-sky-700"
                  onClick={() => handleTagSelect(tag)}
                >
                  {tag}
                </div>
              ))}
            </div>
          )}

          {/* List of chosen tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {userData.selectedTags?.map((tag) => (
              <span
                key={tag}
                className="bg-sky-200 text-sky-900 px-3 py-1 rounded-full cursor-pointer hover:bg-sky-300"
                onClick={() => handleTagRemove(tag)}
              >
                {tag} ✖
              </span>
            ))}
          </div>
        </form>
      </div>
    </>
  );
}
