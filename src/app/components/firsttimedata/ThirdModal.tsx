import { UserData } from "./FirstTimeData";

interface ThirdModalProps {
    userData: UserData;
}

export default function ThirdModal({ userData }: ThirdModalProps) {
    return (
        <div className="text-center p-6 bg-white rounded-lg shadow-lg w-[500px] mx-auto">
            <h2 className="text-2xl text-sky-900 font-semibold mb-4">Summary of Your Information</h2>
            
            {/* Name */}
            <p className="text-lg">
                <strong className="text-sky-700">Name:</strong> {userData.name || <span className="text-gray-500">Not provided</span>}
            </p>

            {/* About Me */}
            <p className="text-lg mt-2">
                <strong className="text-sky-700">About Me:</strong> {userData.aboutMe || <span className="text-gray-500">Not provided</span>}
            </p>

            {/* Preferred Tags */}
            <div className="mt-4">
                <strong className="text-sky-700">Preferred Tags:</strong>
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                    {userData.selectedTags && userData.selectedTags.length > 0 ? (
                        userData.selectedTags.map((tag, index) => (
                            <span key={index} className="bg-sky-300 text-sky-900 px-3 py-1 rounded-full text-sm shadow">
                                {tag}
                            </span>
                        ))
                    ) : (
                        <p className="text-gray-500">None selected</p>
                    )}
                </div>
            </div>

            {/* Profile Picture */}
            <div className="mt-6">
                <strong className="text-sky-700">Profile Picture:</strong>
                {userData.imageSrc ? (
                    <div className="mt-4 flex justify-center">
                        <img
                            src={userData.imageSrc}
                            alt="Profile"
                            className="w-32 h-32 rounded-full border-4 border-sky-500 object-cover shadow-md"
                        />
                    </div>
                ) : (
                    <p className="text-gray-500 mt-2">No picture uploaded</p>
                )}
            </div>

            <p className="text-sky-600 text-sm mt-6">Remember - You can change any of this information in Profile tab or Settings</p>
        </div>
    );
}
