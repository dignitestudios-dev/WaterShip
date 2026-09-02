"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { getCookie } from "@/lib/cookie";

export const DashboardHeader = () => {
  const router = useRouter();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(!!getCookie("token"));
  }, []);

  return (
    <header className="w-full h-[115px] bg-gradient-to-r from-white from-60% to-[#E4F0FB] shadow-[0px_0px_30px_rgba(255,255,255,0.15)] flex items-center justify-between px-6 lg:px-[130px] z-50 relative">
      {/* Left: Logo */}
      <div 
        className="flex items-center h-full py-4 cursor-pointer"
        onClick={() => router.push("/dashboard")}
      >
        <Image
          src="/images/logo-2.webp"
          alt="Watership Logo"
          width={220}
          height={70}
          className="object-contain w-auto h-auto"
          priority
        />
      </div>

      {/* Right: Profile */}
      {hasToken && (
        <div className="flex items-center gap-[15px]">
          {/* Bell Icon */}
          <div 
            className="w-[43px] h-[43px] rounded-full bg-[#DDEBF8] shadow-[0px_0px_33px_rgba(3,69,147,0.15)] flex items-center justify-center relative cursor-pointer hover:bg-[#DDEBF8]/80 transition"
            onClick={() => router.push("/dashboard/notifications")}
          >
            <Bell className="w-5 h-5 text-[#034593]" fill="white" />
            <div className="absolute top-[13px] right-[10px] w-[6.6px] h-[6.6px] bg-[#D11D21] rounded-full" />
          </div>

          {/* Profile Info */}
          <div 
            className="flex items-center gap-[10px] cursor-pointer"
            onClick={() => router.push("/dashboard/profile")}
          >
            <div className="flex flex-col items-start">
              <span className="text-[#727272] text-[12px] leading-[18px] tracking-[-0.01em]">
                Good Evening!
              </span>
              <span className="text-[#727272] text-[20px] leading-[30px] tracking-[-0.01em] font-normal">
                Olivia Rose
              </span>
            </div>
            <div className="w-[38px] h-[38px] rounded-full border-[1.5px] border-[#DDEBF8] overflow-hidden bg-gray-200">
              {/* If there was a real avatar it would go here. For now a placeholder */}
              <Image src={"/images/img.webp"} alt="image" width={100} height={100} className="w-full h-full object-cover" />
              {/* <div className="w-full h-full bg-slate-300" /> */}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
