"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { getCookie } from "@/lib/cookie";
import { useGetMe } from "@/features/users/api/users.queries";
import { useUnreadNotificationCount } from "@/features/notification";

export const DashboardHeader = () => {
  const router = useRouter();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(!!getCookie("token"));
  }, []);

  const { data: getMeResponse, isLoading } = useGetMe({ enabled: hasToken });
  const { data: unreadResponse } = useUnreadNotificationCount();

  const unreadCount = typeof unreadResponse?.data === "number"
    ? unreadResponse.data
    : (unreadResponse?.data?.unreadCount ?? unreadResponse?.data?.count ?? 0);

  const user = getMeResponse?.data;
  const fullName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user?.firstName || user?.lastName || "User";
  const initial = (fullName.trim().charAt(0) || "U").toUpperCase();

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
            {unreadCount > 0 && (
              <div className="absolute top-[10px] right-[9px] min-w-[8px] h-[8px] bg-[#D11D21] rounded-full ring-2 ring-white" />
            )}
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
              <span className="text-[#727272] text-[20px] leading-[30px] tracking-[-0.01em] font-normal truncate max-w-[150px]">
                {isLoading ? "Loading..." : fullName}
              </span>
            </div>
            <div className="w-[38px] h-[38px] rounded-full border-[1.5px] border-[#DDEBF8] overflow-hidden bg-gradient-to-tr from-[#034593] to-[#2186FF] flex items-center justify-center text-white font-semibold text-[15px] select-none shadow-sm">
              {user?.profilePicture?.location ? (
                <Image src={user.profilePicture.location} alt="Profile Picture" width={100} height={100} className="w-full h-full object-cover" />
              ) : (
                <span>{initial}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
