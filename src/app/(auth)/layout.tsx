"use client"
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  console.log(pathname)
  return (

    <div className="w-full min-h-screen relative flex overflow-hidden shadow-2xl bg-linear-to-b from-[#034593] to-[#01152D]">
      {/* Abstract Blur Blobs */}
      <div className="absolute -top-[189px] left-[10%] w-[451px] h-[492px] bg-[#2186FF] opacity-45 blur-[203px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-[167px] -right-[206px] w-[451px] h-[492px] bg-[#2186FF] opacity-45 blur-[203px] rounded-full pointer-events-none" />

      {/* Left Side (Image Panel) */}
      <div className="hidden lg:flex w-full max-w-[931px] m-4 relative rounded-[23px] overflow-hidden">
        {/* Main Background Image */}
        <Image
          src={pathname == "/verify-email" ? "/images/verify.webp" : "/images/left-img.webp"}
          alt="Family in park"
          fill
          className="object-cover object-top"
          priority
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(2,42,87,0.25)] to-[rgba(2,42,87,0.25)]" />
        <div className="absolute top-0 inset-x-0 h-[431px] bg-gradient-to-b from-[#023168] to-transparent opacity-80" />

        {/* Top Left Logo Area */}
        <div className="absolute top-8 left-8 flex items-center gap-6 z-10">
          <Image
            src={ "/images/logo.webp"}
            alt="Logo"
            width={290}
            height={296}
            className="object-contain"
          />
        </div>
      </div>

      {/* Right Side (Form Area) */}
      <div className="flex-1 flex flex-col justify-center items-center relative z-10 py-8">
        <div className="w-full ">
          {children}
        </div>
      </div>
    </div>

  );
}
