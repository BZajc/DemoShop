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
    <div className="w-full flex flex-col items-center p-4">
      <h2 className="text-xl text-sky-950 mb-4">Set Your Profile Picture</h2>
  
      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
  
      {/* Upload button */}
      <label
        htmlFor="file-upload"
        className="cursor-pointer mb-4 px-4 py-2 bg-sky-200 text-sky-900 rounded-full hover:bg-sky-400 hover:text-white transition-all"
      >
        Upload Image
      </label>
  
      {userData.imageSrc && (
        <>
          {/* Preview circle */}
          <div className="mb-4 w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-sky-500 bg-gray-300 relative">
            <Image
              src={userData.imageSrc}
              alt="Profile Preview"
              fill
              className="object-cover w-full h-full cursor-grab active:cursor-grabbing"
            />
          </div>
  
          {/* Remove button */}
          <button
            onClick={handleRemovePicture}
            className="px-4 py-2 bg-sky-200 text-sky-900 rounded-full hover:bg-sky-400 hover:text-white transition-all"
          >
            Remove Picture
          </button>
        </>
      )}
    </div>
  );
  
  
}
