import Image from "next/image";
import { UserData } from "./UserInformation";

interface SecondModalProps {
  userData: UserData;
  handleDataChange: (data: UserData) => void;
}

export default function SecondModal({
  userData,
  handleDataChange,
}: SecondModalProps) {
  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      // File format validation
      if (!file.type.startsWith("image/")) {
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        handleDataChange({ ...userData, imageSrc: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePicture = () => {
    handleDataChange({ ...userData, imageSrc: null });
  };

  return (
    <div className="text-center p-4 ">
      <h2 className="text-xl text-sky-950 mb-4">Set Your Profile Picture</h2>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer px-4 py-2 bg-sky-200 text-sky-900 rounded-full hover:bg-sky-400 hover:text-white transition-all"
      >
        Upload Image
      </label>

      {userData.imageSrc && (
        <div className="mt-4 flex flex-col items-center">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-sky-500 bg-gray-300">
            <Image
              src={userData.imageSrc}
              alt="Profile Preview"
              fill
              className="object-cover cursor-grab active:cursor-grabbing"
              sizes="128px"
            />
          </div>

          {/* Submit Button */}
          <button
            className="mt-4 bg-sky-200 rounded-full py-2 px-4 text-sky-900 hover:text-white hover:bg-sky-400 transition"
            onClick={handleRemovePicture}
          >
            Remove Picture
          </button>
        </div>
      )}
    </div>
  );
}
