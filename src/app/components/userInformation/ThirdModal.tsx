import type { UserData } from "./UserInformation";
import Image from "next/image";

interface ThirdModalProps {
  userData: UserData;
}

export default function ThirdModal({ userData }: ThirdModalProps) {
  return (
    <div className="w-full max-w-sm md:max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      {userData.imageSrc && (
        <div className="mb-4 w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-sky-500 bg-gray-200 relative mx-auto">
          <Image
            src={userData.imageSrc}
            alt="Profile Preview"
            fill
            className="object-cover"
            sizes="128px"
            priority
          />
        </div>
      )}

      <h2 className="text-2xl text-sky-900 font-semibold mb-4 text-center">
        Summary of Your Information
      </h2>

      <div className="space-y-3 text-left">
        <p>
          <strong>Name:</strong>{" "}
          {userData.name || (
            <span className="text-gray-500">Not provided</span>
          )}
        </p>

        <p>
          <strong>About Me:</strong>{" "}
          {userData.aboutMe || (
            <span className="text-gray-500">Not provided</span>
          )}
        </p>

        <div>
          <strong>Preferred Tags:</strong>
          <div className="mt-1 flex flex-wrap gap-2">
            {userData.selectedTags?.length ? (
              userData.selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="bg-sky-300 text-sky-900 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))
            ) : (
              <p className="text-gray-500">None selected</p>
            )}
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm text-gray-600 text-center">
        Remember – You can change this later in Settings.
      </p>
    </div>
  );
}
