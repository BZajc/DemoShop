"use client";
import { useState, useEffect } from "react";

export default function FirstTimeData() {
  const [tagInput, setTagInput] = useState("");
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]); // Suggested tags
  const [selectedTags, setSelectedTags] = useState<string[]>([]); // Selected tags
  const [errorMessage, setErrorMessage] = useState("");

  // Example list
  const availableTags = [
    "#Sun",
    "#Summer",
    "#Sweet",
    "#Sky",
    "#Snow",
    "#Sports",
    "#Super",
    "#Sunrise",
    "#SunnyDay",
  ];

  //   Filter tags
  useEffect(() => {
    if (tagInput.length > 0) {
      const filteredTags = availableTags.filter((tag) =>
        tag.toLowerCase().includes(tagInput.toLowerCase())
      );
      setSuggestedTags(filteredTags);
    } else {
      setSuggestedTags([]);
    }
  }, [tagInput]);

  //   Add selected tag to an array
  const handleTagSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setTagInput("");
    setSuggestedTags([]);
  };

  //   Add new tag function
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      //   Do not add tag if input is empty
      if (!tagInput.trim()) return;

      //   Remove "#" from the start of tag
      const cleanedTag = tagInput.replace(/^#+/, "");

      //   Allow only common letters and numbers (and "_")
      const sanitizedTag = cleanedTag.replace(/[^a-zA-Z0-9_]/g, "");

      //   Limit marks
      if (sanitizedTag.length > 20) {
        setErrorMessage("❌ Tag can have a maximum of 20 characters.");
        return;
      }

      //   Throw error if tag is empty
      if (!sanitizedTag) {
        setErrorMessage(
          "❌ The tag must contain at least one valid character."
        );
        return;
      }

      //   Remove unnecessary #'s
      const formattedTag = `#${sanitizedTag}`;

      //   Adding tag to array if doesnt exist
      if (!selectedTags.includes(formattedTag)) {
        setSelectedTags([...selectedTags, formattedTag]);
        setErrorMessage("");
      }
      setTagInput("");
      setSuggestedTags([]);
    }
  };

  //   Remove tag on click
  const handleTagRemove = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  return (
    <section className="fixed top-0 left-0 w-full h-full bg-black/85 z-[999] flex items-center justify-center animate-fade-in">
      <div className="bg-white p-4 rounded-lg text-center max-w-[600px]">
        <h2 className="text-xl text-sky-950">
          Hey, it looks like you're visiting Picbook for the first time!
        </h2>
        <p>
          Start by personalizing your preferences and providing some basic
          information about yourself and your interests.
        </p>
        <div className="flex w-full gap-x-4 mt-4">
          {/* Left column */}
          <div className="w-1/2">
            <form className="flex flex-col text-start mt-4">
              <label htmlFor="realname">🕵🏻‍♀️ What's your real name?</label>
              <input
                type="text"
                name="realname"
                placeholder="Name and surname"
                className="border-b-2 border-sky-400 mb-4 outline-none focus:bg-sky-200 transition-all p-1"
              />
              <label htmlFor="aboutme">❓ Say something about yourself</label>
              <textarea
                name="aboutme"
                placeholder="What do you like to do? Your hobbies? What are you looking for on Picbook?"
                className="border-b-2 border-sky-400 max-h-[300px] mb-4 outline-none focus:bg-sky-200 transition-all p-1"
              />
            </form>
          </div>

          {/* Right column */}
          <div className="w-1/2">
            <form className="flex flex-col text-start mt-4 relative">
              <label htmlFor="tags">❤️ What are your preferred tags?</label>
              <p className="text-[0.75rem] text-sky-700">
                There are predefined tags to choose from. You can create a
                custom one, but using existing tags will help you find posts
                more easily.
              </p>

              <input
                type="text"
                name="tags"
                placeholder="Type a tag (e.g. #Sky, #Sun)..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="border-b-2 border-sky-400 outline-none focus:bg-sky-200 transition-all p-1"
              />

              {/* Display error when tag adding requirements werent meet */}
              {errorMessage && (
                <p className="text-rose-600 text-sm mt-1">{errorMessage}</p>
              )}

              {/* List of suggested tags */}
              {suggestedTags.length > 0 && (
                <div className="absolute bg-white border border-sky-400 w-full rounded-lg mt-1 shadow-lg z-50 max-h-[400px] overflow-y-auto">
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

              {/* List of selected tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
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

            {/* Advance to image select */}
            <button className="mt-4 bg-sky-200 rounded-full py-2 px-4 duration-300 transition-all text-sky-900 hover:text-white hover:bg-sky-400 hover:scale-[1.05]">
              Continue
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
