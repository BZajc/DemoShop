"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import LoginForm from "@/app/components/sign/LoginForm";
import RegisterForm from "@/app/components/sign/RegisterForm";

export default function SignForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const formType = searchParams.get("form") || "login";

  // Form change
  const handleFormChange = (showRegisterForm: boolean) => {
    router.push(
      `${window.location.pathname}?form=${
        showRegisterForm ? "register" : "login"
      }`,
      { scroll: false }
    );

    setTimeout(() => {
      const formContainer = document.getElementById("sign-form-container");
      if (formContainer) {
        formContainer.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const scrollToForm = () => {
    const formSection = document.getElementById("sign-form-container");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* First Container */}
      <div
        className="flex items-center flex-1 bg-no-repeat bg-cover bg-center flex-col pt-16 min-h-screen relative md:max-w-[50%]"
        style={{ backgroundImage: "url('/images/signFormBg.webp')" }}
      >
        <div className="animate-fade-in">
          <Image
            src="/images/picbookLogo.png"
            alt="picbook logo"
            className="m-auto"
            width={50}
            height={50}
          />
          <header>
            <h1 className="text-white text-4xl text-center p-4">
              Join our community
            </h1>
            <p className="text-white md:text-lg text-base py-4 px-16 tracking-widest">
              Share your best moments with the world and explore an ever-growing
              feed full of creative and inspiring photos captured by talented
              photographers from all around the globe.
            </p>
            <p className="text-white md:text-lg text-base py-4 px-16 tracking-widest">
              Connect with passionate photographers, engage in meaningful
              conversations, and dive into a thriving creative community.
            </p>
          </header>
        </div>

        <div className="grid grid-cols-3 gap-2 p-2 m-1">
          <div className="flex flex-col items-center justify-center backdrop-blur-sm p-2 rounded-full text-center">
            <p className="text-white text-sm md:text-xl">10k+ Users</p>
          </div>
          <div className="flex flex-col items-center justify-center backdrop-blur-sm p-2 rounded-full text-center">
            <p className="text-white text-sm md:text-xl">7.5k+ Pictures</p>
          </div>
          <div className="flex flex-col items-center justify-center backdrop-blur-sm p-2 rounded-full text-center">
            <p className="text-white text-sm md:text-xl">50k+ comments</p>
          </div>
        </div>

        <div className="absolute w-full bottom-0 p-4 hidden md:block">
          <p className="text-white text-center">Only for visual purposes</p>
          <ul className="flex items-center justify-evenly flex-wrap">
            <li>
              <button className="text-white text-lg cursor-pointer hover:text-sky-400 transition-colors duration-300 p-2">
                Terms of Service
              </button>
            </li>
            <li>
              <button className="text-white text-lg cursor-pointer hover:text-sky-400 transition-colors duration-300 p-2">
                Privacy Policy
              </button>
            </li>
            <li>
              <button className="text-white text-lg cursor-pointer hover:text-sky-400 transition-colors duration-300 p-2">
                Cookies
              </button>
            </li>
            <li>
              <button className="text-white text-lg cursor-pointer hover:text-sky-400 transition-colors duration-300 p-2">
                Contact
              </button>
            </li>
            <li>
              <button className="text-white text-lg cursor-pointer hover:text-sky-400 transition-colors duration-300 p-2">
                FAQ
              </button>
            </li>
            <li>
              <button className="text-white text-lg cursor-pointer hover:text-sky-400 transition-colors duration-300 p-2">
                Licenses
              </button>
            </li>
            <li>
              <button className="text-white text-lg cursor-pointer hover:text-sky-400 transition-colors duration-300 p-2">
                Partners
              </button>
            </li>
          </ul>
        </div>

        {/* Displayed only on mobile */}
        <div className="flex flex-col p-4">
          <Button
            variant="default"
            className="text-2xl rounded-full border-2 border-white m-2 md:hidden"
            onClick={() => scrollToForm()}
          >
            Get Started
          </Button>
        </div>
      </div>
      {/* Second Container */}
      <div
        id="sign-form-container"
        className="flex-1 min-h-screen pt-16 flex flex-col w-full md:max-w-lg mx-auto"
      >
        {/* Display form depending on search params */}
        {formType === "register" ? (
          <RegisterForm handleFormChange={handleFormChange} />
        ) : (
          <LoginForm handleFormChange={handleFormChange} />
        )}

        <div className="w-full p-4 block md:hidden bg-stone-800 mt-12">
          <p className="text-white text-center">Only for visual purposes</p>
          <ul className="flex items-center justify-evenly flex-wrap">
            <li>
              <button className="text-white text-lg cursor-pointer hover:text-sky-400 transition-colors duration-300 p-2">
                Terms of Service
              </button>
            </li>
            <li>
              <button className="text-white text-lg cursor-pointer hover:text-sky-400 transition-colors duration-300 p-2">
                Privacy Policy
              </button>
            </li>
            <li>
              <button className="text-white text-lg cursor-pointer hover:text-sky-400 transition-colors duration-300 p-2">
                Cookies
              </button>
            </li>
            <li>
              <button className="text-white text-lg cursor-pointer hover:text-sky-400 transition-colors duration-300 p-2">
                Contact
              </button>
            </li>
            <li>
              <button className="text-white text-lg cursor-pointer hover:text-sky-400 transition-colors duration-300 p-2">
                FAQ
              </button>
            </li>
            <li>
              <button className="text-white text-lg cursor-pointer hover:text-sky-400 transition-colors duration-300 p-2">
                Licenses
              </button>
            </li>
            <li>
              <button className="text-white text-lg cursor-pointer hover:text-sky-400 transition-colors duration-300 p-2">
                Partners
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
