"use client";
import { User, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { registerUser } from "../../api/actions/registerAction";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface RegisterFormProps {
  handleFormChange: (showRegisterForm: boolean) => void;
}

export default function RegisterForm({ handleFormChange }: RegisterFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const result = await registerUser(formData);

    if (result.errors) {
      setErrors(result.errors);
    } else if (result.success) {
      setErrors({});
      router.push(`${window.location.pathname}?form=login&success=true`, {
        scroll: false,
      });

      setTimeout(() => {
        const formContainer = document.getElementById("sign-form-container");
        if (formContainer) {
          formContainer.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col animate-fade-in">
      <h2 className="text-sky-400 text-6xl text-center p-4">Create Account</h2>
      {/* App Register Form */}
      <form
        className="p-4 mt-4 flex flex-col items-center mx-auto w-[90%]"
        onSubmit={handleSubmit}
      >
        {/* Username */}
        <p className="inline-flex items-center mt-8 border-b-2 border-sky-400 relative p-2 w-fit">
          <User size={32} strokeWidth={1} className="absolute left-0" />
          <input
            className="pl-10 w-auto bg-transparent outline-none"
            type="text"
            name="name"
            placeholder="Username"
            required
          />
        </p>
        {errors.name && <p className="text-red-500">{errors.name}</p>}

        {/* Email */}
        <p className="inline-flex items-center mt-8 border-b-2 border-sky-400 relative p-2 w-fit">
          <Mail size={32} strokeWidth={1} className="absolute left-0" />
          <input
            className="pl-10 w-auto bg-transparent outline-none"
            type="email"
            name="email"
            placeholder="Email"
            required
          />
        </p>
        {errors.email && <p className="text-red-500">{errors.email}</p>}

        {/* Password */}
        <p className="inline-flex items-center mt-8 border-b-2 border-sky-400 relative p-2 w-fit">
          <Lock size={32} strokeWidth={1} className="absolute left-0" />
          <input
            className="pl-10 w-auto bg-transparent outline-none"
            type="password"
            name="password"
            placeholder="Password"
            required
          />
        </p>
        {errors.password && <p className="text-red-500">{errors.password}</p>}

        {/* Confirm Password */}
        <p className="inline-flex items-center mt-8 mb-4 border-b-2 border-sky-400 relative p-2 w-fit">
          <Lock size={32} strokeWidth={1} className="absolute left-0" />
          <input
            className="pl-10 w-auto bg-transparent outline-none"
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
          />
        </p>
        {errors.confirmPassword && (
          <p className="text-red-500">{errors.confirmPassword}</p>
        )}
        <Button
          className="mx-auto rounded-full text-2xl border-sky-400 border-2 bg-white text-sky-400 hover:bg-black hover:text-white hover:border-black px-16"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            "Register"
          )}
        </Button>
      </form>

      {/* Form Swap */}
      <div className="border-b-2 border-sky-400 w-[30%] my-4 mx-auto" />
      <p className="text-center text-2xl text-sky-400">
        Already have an account?
      </p>
      <Button
        variant="default"
        className="mx-auto my-4 rounded-full text-2xl border-sky-400 border-2 bg-white text-sky-400 hover:bg-black hover:text-white hover:border-black"
        onClick={() => handleFormChange(false)}
      >
        Log In Here
      </Button>
    </div>
  );
}
