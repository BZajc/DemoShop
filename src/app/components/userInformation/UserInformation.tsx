"use client";
import { useEffect, useState } from "react";
import FirstModal from "./FirstModal";
import SecondModal from "./SecondModal";
import ThirdModal from "./ThirdModal";
import { updateUserData } from "@/app/api/actions/userData/updateUserData";
import { X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { completeUserSetup } from "@/app/api/actions/userData/completeSetup";

export interface UserData {
  name?: string;
  aboutMe?: string;
  selectedTags?: string[];
  imageSrc?: string | null;
}

interface UserInformationProps {
  initialData?: UserData;
  onClose?: () => void;
}

export default function UserInformation(props: UserInformationProps) {
  const { initialData, onClose } = props;
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<UserData>({
    name: initialData?.name || "",
    aboutMe: initialData?.aboutMe || "",
    selectedTags: initialData?.selectedTags || [],
    imageSrc: initialData?.imageSrc || null,
  });
  const [isVisible, setIsVisible] = useState(true);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleDataChange = (newData: UserData) => {
    setUserData((prev) => ({ ...prev, ...newData }));
  };

  useEffect(() => {
    if (!isVisible && onClose) {
      onClose();
    }
  }, [isVisible]);

  // Remove scroll from body if modal is visible
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible]);

  if (!isVisible) return null;

  async function handleSubmit() {
    if (step === 3) {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("name", userData.name || "");
      formData.append("aboutMe", userData.aboutMe || "");
      formData.append("selectedTags", JSON.stringify(userData.selectedTags));

      if (userData.imageSrc) {
        const imageFile = await fetch(userData.imageSrc).then((res) =>
          res.blob()
        );
        formData.append("image", imageFile, "avatar.jpg");
      }

      const response = await updateUserData(formData);

      if (response.success) {
        setIsVisible(false);
        await completeUserSetup();
        console.log("User data updated successfully!", response.user);
        router.push(
          `/profile/${response?.user?.name}/${response?.user?.hashtag}`
        );
      } else {
        console.error("Failed to update user data:", response.error);
      }

      setIsSubmitting(false);
    } else {
      setStep(step + 1);
    }
  }

  return (
    <section
      onClick={(e) => {
        if (e.target === e.currentTarget) setShowConfirmPopup(true);
      }}
      className="overflow-hidden fixed top-0 left-0 w-full h-full bg-black/85 z-[999] flex items-center justify-center animate-fade-in"
    >
      <div className="bg-white rounded-lg text-center w-[600px] relative overflow-hidden max-h-[90vh] overflow-y-auto">
        <button
          className="absolute p-2 top-0 right-0 cursor-pointer z-10 transition-all duration-300 hover:scale-[1.20]"
          onClick={() => setShowConfirmPopup(true)}
        >
          <X />
        </button>

        <div
          className="flex transition-transform duration-500 w-[1800px]"
          style={{ transform: `translateX(-${(step - 1) * 600}px)` }}
        >
          {/* First Modal */}
          <div className="w-[600px] p-4 shrink-0">
            <FirstModal
              userData={userData}
              handleDataChange={handleDataChange}
            />
          </div>

          {/* Second Modal */}
          <div className="w-[600px] p-4 shrink-0">
            <SecondModal
              userData={userData}
              handleDataChange={handleDataChange}
            />
          </div>

          {/* Third Modal */}
          <div className="w-[600px] p-4 shrink-0">
            <ThirdModal userData={userData} />
          </div>
        </div>

        {/* Buttons Section */}
        <div className="mt-4 flex justify-between p-4">
          {/* Back button only visible on step 2 and 3 */}
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              disabled={isSubmitting}
              className={`bg-gray-300 rounded-full py-2 px-4 duration-300 transition-all text-gray-900 hover:text-white hover:bg-gray-500 hover:scale-[1.05] ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Back
            </button>
          )}

          {/* Continue and Submit button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`ml-auto bg-sky-200 rounded-full py-2 px-4 duration-300 transition-all text-sky-900 hover:text-white hover:bg-sky-400 hover:scale-[1.05] ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={24} />
            ) : step === 3 ? (
              "Submit"
            ) : (
              "Continue"
            )}
          </button>
        </div>
      </div>

      {/* Confirm Popup to close modal */}
      {showConfirmPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-[1000]">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-[400px]">
            <h3 className="text-lg font-semibold text-gray-900">
              Are you sure?
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              You can always update your profile information later in settings.
            </p>

            <div className="flex justify-center gap-4 mt-4">
              <button
                className="bg-gray-300 text-gray-900 py-2 px-4 rounded-full transition hover:bg-gray-400"
                onClick={() => setShowConfirmPopup(false)}
              >
                No
              </button>

              <button
                className="bg-red-500 text-white py-2 px-4 rounded-full transition hover:bg-red-600"
                onClick={() => {
                  setIsVisible(false);
                  setShowConfirmPopup(false);
                }}
              >
                Yes, Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
