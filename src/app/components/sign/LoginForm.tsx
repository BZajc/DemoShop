"use client";
import { User, Lock, Github } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface LoginFormProps {
  handleFormChange: (showRegisterForm: boolean) => void;
}

export default function LoginForm({ handleFormChange }: LoginFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const successMessage = searchParams.get("success") === "true";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const identifier = formData.get("identifier")?.toString().trim() || "";
    const password = formData.get("password")?.toString().trim() || "";

    const result = await signIn("credentials", {
      redirect: false,
      email: identifier,
      password: password,
    });

    if (result?.error) {
      setErrors({ identifier: "Invalid credentials" });
    } else {
      router.push("/");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col animate-fade-in">
      <h2 className="text-sky-400 text-6xl text-center p-4">Log In</h2>
      {successMessage && (
        <p className="text-green-500 text-center text-xl">
          Account created successfully.
        </p>
      )}

      {/* App Log In Form*/}
      <form
        className="p-4 mt-4 flex flex-col items-center border-2 border-sky-400 mx-auto w-[90%]"
        onSubmit={handleSubmit}
      >
        <p className="inline-flex items-center my-4 border-b-2 border-sky-400 relative p-2 w-fit">
          <User size={32} strokeWidth={1} className="absolute left-0" />
          <input
            className="pl-10 w-auto bg-transparent outline-none"
            type="text"
            placeholder="Email or Username"
            name="identifier"
            required
          />
        </p>
        {errors.identifier && (
          <p className="text-red-500">{errors.identifier}</p>
        )}
        <p className="inline-flex items-center mt-4 border-b-2 border-sky-400 relative p-2 w-fit">
          <Lock size={32} strokeWidth={1} className="absolute left-0" />
          <input
            className="pl-10 w-auto bg-transparent outline-none"
            type="password"
            placeholder="Password"
            name="password"
            required
          />
        </p>
        {errors.password && <p className="text-red-500">{errors.password}</p>}
        <button className="px-4 py-2 mb-4 mr-[7rem] text-gray-500">
          {/* Forgot password? */}
        </button>

        {isSubmitting ? (
          <Loader2 className="animate-spin text-sky-400" size={24} />
        ) : (
          <button className="mx-auto rounded-full text-2xl border-sky-400 border-2 bg-white text-sky-400 hover:bg-black hover:text-white hover:border-black px-16">
            Log In
          </button>
        )}
      </form>

      <p className="p-4 pb-0 text-sky-400 text-4xl text-center mt-4">OR</p>
      <p className="text-center text-2xl text-sky-400">use GitHub</p>

      {/* Providers Log In */}
      <div className="flex items-center justify-center gap-4">
        {isSubmitting ? (
          <Loader2 className="animate-spin text-sky-400" size={24} />
        ) : (
          <>
            <button
              className="my-4 rounded-full w-16 h-16 flex items-center justify-center border-2 border-black bg-white text-black hover:border-transparent hover:bg-black hover:text-white transition-colors duration-300"
              onClick={() => signIn("github", { callbackUrl: "/" })}
            >
              <Github size={32} />
            </button>
          </>
        )}
      </div>

      {/* Form Swap */}
      <p className="text-center text-2xl text-sky-400">
        Don&apos;t have an account yet?
      </p>
      <button
        className="mx-auto my-4 rounded-full text-2xl border-sky-400 border-2 bg-white text-sky-400 hover:bg-black hover:text-white hover:border-black p-2"
        onClick={() => handleFormChange(true)}
      >
        Create Here
      </button>
    </div>
  );
}
