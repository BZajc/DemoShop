'use client';
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
  const [step, setStep]             = useState(1);
  const [userData, setUserData]     = useState<UserData>({
    name: initialData?.name || "",
    aboutMe: initialData?.aboutMe || "",
    selectedTags: initialData?.selectedTags || [],
    imageSrc: initialData?.imageSrc || null,
  });
  const [isVisible, setIsVisible]         = useState(true);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const router = useRouter();

  const handleDataChange = (newData: UserData) => {
    setUserData(prev => ({ ...prev, ...newData }));
  };

  useEffect(() => {
    if (!isVisible && onClose) {
      onClose();
    }
  }, [isVisible]);

  useEffect(() => {
    document.body.style.overflow = isVisible ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
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
        const blob = await fetch(userData.imageSrc).then(r => r.blob());
        formData.append("image", blob, "avatar.jpg");
      }
      const response = await updateUserData(formData);
      if (response.success) {
        setIsVisible(false);
        await completeUserSetup();
        router.push(`/profile/${response?.user?.name}/${response?.user?.hashtag}`);
      } else {
        console.error("Update failed", response.error);
      }
      setIsSubmitting(false);
    } else {
      setStep(s => s + 1);
    }
  }

  // when user confirms exit
  const confirmExit = () => {
    setShowConfirmPopup(false);
    setIsVisible(false);
  };

  return (
    <section
      onClick={e => {
        // only backdrop
        if (e.target === e.currentTarget) {
          setShowConfirmPopup(true);
        }
      }}
      className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 overflow-auto"
    >
      <div className="relative w-full max-w-md md:max-w-xl bg-white rounded-lg overflow-hidden max-h-[90vh]">
        <button
          className="absolute top-2 right-2 p-2 hover:scale-110 z-20"
          onClick={() => setShowConfirmPopup(true)}
        >
          <X size={24} />
        </button>

        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
        >
          <div className="w-full flex-shrink-0 p-4">
            <FirstModal userData={userData} handleDataChange={handleDataChange} />
          </div>
          <div className="w-full flex-shrink-0 p-4">
            <SecondModal userData={userData} handleDataChange={handleDataChange} />
          </div>
          <div className="w-full flex-shrink-0 p-4">
            <ThirdModal userData={userData} />
          </div>
        </div>

        <div className="flex justify-between p-4">
          {step > 1 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400"
              disabled={isSubmitting}
            >
              Back
            </button>
          )}
          <button
            onClick={handleSubmit}
            className="ml-auto px-4 py-2 bg-sky-200 rounded-full hover:bg-sky-400"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? <Loader2 className="animate-spin" />
              : step === 3
                ? "Submit"
                : "Continue"
            }
          </button>
        </div>
      </div>

      {/* Confirm Popup */}
      {showConfirmPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-60"
          onClick={e => e.stopPropagation()}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs text-center">
            <p className="mb-4 text-gray-800">
              Discard changes and close?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowConfirmPopup(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmExit}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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
