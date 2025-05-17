import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section
      className="relative h-[60vh] flex items-center justify-center bg-fixed bg-center bg-cover"
      style={{ backgroundImage: "url('/HeroImage.webp')" }}
    >
      {/* BG overlay */}
      <div className="absolute inset-0 bg-black/50 dark:bg-zinc-900/50 z-0" />

      <div className="relative z-10 text-center px-6 flex flex-col items-center">
        {/* Logo */}
        <Image
          src="/DemoShopLogoTransparent.png"
          alt="DemoShop Logo"
          width={120}
          height={120}
          className="mb-4"
        />

        <h1 className="text-4xl sm:text-5xl font-bold text-white dark:text-white mb-4 drop-shadow-lg">
          Discover Endless Possibilities
        </h1>
        <p className="text-base sm:text-lg text-gray-200 dark:text-gray-300 max-w-xl mx-auto mb-6 drop-shadow-md">
          Your go-to shop for fashion, gadgets, lifestyle, and everything in
          between.
        </p>
        <Button
          asChild
          variant="demoshop"
        >
          <a href="/products">Shop Now</a>
        </Button>
      </div>
    </section>
  );
}
