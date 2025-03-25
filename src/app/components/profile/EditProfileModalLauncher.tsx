"use client";
import { useState } from "react";
import { Pencil } from "lucide-react";
import UserInformation, { UserData } from "@/app/components/userInformation/UserInformation";

interface Props {
  initialData: UserData;
}

export default function EditProfileModalLauncher({ initialData }: Props) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-sky-500 text-white px-4 py-2 rounded-full hover:bg-sky-700 transition flex items-center"
      >
        <Pencil size={16} className="mr-2" />
        Edit Profile
      </button>

      {showModal && (
        <UserInformation
          initialData={initialData}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
