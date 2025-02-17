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

  // List of available tags
  const availableTags = [
    "#Sun",
    "#Summer",
    "#Sweet",
    "#Sky",
    "#Snow",
    "#Super",
    "#Sunrise",
    "#SunnyDay",
    "#Adventure",
    "#Art",
    "#Autumn",
    "#Beach",
    "#Beautiful",
    "#Bike",
    "#Books",
    "#Business",
    "#Camping",
    "#Car",
    "#Cats",
    "#City",
    "#Coffee",
    "#Cooking",
    "#Culture",
    "#Dance",
    "#Design",
    "#Dogs",
    "#Drawing",
    "#Education",
    "#Electronics",
    "#Entertainment",
    "#Family",
    "#Fashion",
    "#Fitness",
    "#Food",
    "#Friends",
    "#Gaming",
    "#Gardening",
    "#Goals",
    "#Happiness",
    "#Health",
    "#Hiking",
    "#History",
    "#Home",
    "#Inspiration",
    "#Interior",
    "#Investment",
    "#Island",
    "#Journal",
    "#Journey",
    "#Kids",
    "#Landscapes",
    "#Learning",
    "#Life",
    "#Lifestyle",
    "#Love",
    "#Luxury",
    "#Meditation",
    "#Memories",
    "#Mindfulness",
    "#Minimalism",
    "#Mountains",
    "#Movies",
    "#Music",
    "#Nature",
    "#Night",
    "#Ocean",
    "#Painting",
    "#Party",
    "#Pets",
    "#Photography",
    "#Plants",
    "#Poetry",
    "#Reading",
    "#Relaxing",
    "#Roadtrip",
    "#Science",
    "#Shopping",
    "#Skyline",
    "#Snowboarding",
    "#Space",
    "#Sports",
    "#Startup",
    "#StreetPhotography",
    "#Success",
    "#Sunset",
    "#Surfing",
    "#Sustainability",
    "#Swimming",
    "#Technology",
    "#Tennis",
    "#Theater",
    "#Travel",
    "#Trending",
    "#Universe",
    "#Vacation",
    "#Vegan",
    "#VideoGames",
    "#Vintage",
    "#Waterfall",
    "#Wellness",
    "#Winter",
    "#Workout",
    "#Writing",
    "#Yoga",
    "#Zoology",
  ];

  // Show tags on focus and filter while typing
  useEffect(() => {
    if (tagInput.length > 0) {
      const filteredTags = availableTags.filter(
        (tag) =>
          tag.toLowerCase().includes(tagInput.toLowerCase()) &&
          !userData.selectedTags?.includes(tag) // Hide selected tags from the list if user typed something
      );
      setSuggestedTags(filteredTags);
    } else {
      setSuggestedTags(
        availableTags.filter((tag) => !userData.selectedTags?.includes(tag)) // Hide selected tags from the list if user left input empty
      );
    }
  }, [tagInput, isFocused, userData.selectedTags]);

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
      const cleanedTag = tagInput
        .replace(/^#+/, "")
        .replace(/[^a-zA-Z0-9_]/g, "");

      if (cleanedTag.length > 20) {
        setErrorMessage("❌ Tag can have a maximum of 20 characters.");
        return;
      }

      if (!cleanedTag) {
        setErrorMessage(
          "❌ The tag must contain at least one valid character."
        );
        return;
      }

      const formattedTag = `#${cleanedTag}`;

      if (!selectedTags.includes(formattedTag)) {
        setSelectedTags([...selectedTags, formattedTag]);
        setErrorMessage("");
      }
      setTagInput("");
      setSuggestedTags([]);
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
          <p className="text-[0.75rem] text-sky-700">
            There are predefined tags to choose from. You can create a custom
            one, but using existing tags will help you find posts more easily.
          </p>

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
            <div className="absolute bottom-0 bg-white border border-sky-400 w-[50%] rounded-lg mt-1 p-2 shadow-lg z-50 max-h-[400px] overflow-y-auto">
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
