"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";

export default function NotificationPreferencesPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // State for the 4 toggles
  const [toggles, setToggles] = useState([true, true, true, true]);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = (index: number) => {
    const newToggles = [...toggles];
    newToggles[index] = !newToggles[index];
    setToggles(newToggles);
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen relative overflow-hidden bg-gradient-to-b from-[#034593] to-[#01152D] pt-[80px]">
      
      {/* Background Vectors */}
      <div className="absolute left-[calc(50%-451.09px/2-738.45px)] top-[-189px] w-[451.09px] h-[492px] bg-[#2186FF] opacity-45 blur-[203.65px] pointer-events-none" />
      <div className="absolute right-[-206.09px] bottom-[-167px] w-[451.09px] h-[492px] bg-[#2186FF] opacity-45 blur-[203.65px] pointer-events-none" />

      {/* Back Button */}
      <div 
        className="absolute left-[50px] top-[150px] md:top-[126px] w-[30px] h-[30px] rounded-full bg-white/15 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors z-10" 
        onClick={() => router.push("/dashboard/profile")}
      >
        <ChevronLeft className="w-[18px] h-[18px] text-white" strokeWidth={2} />
      </div>

      <div className="flex flex-col pb-20 items-center w-full max-w-[563px] z-10 mt-10 gap-[30px] px-[20px]">
        {/* Header Section */}
        <div className="flex flex-col items-center gap-[25px] text-center max-w-[470px]">
          <h1 className="font-semibold text-[32px] md:text-[40px] leading-[1.2] md:leading-[60px] tracking-[-0.025em] text-white">
            Notification Preferences
          </h1>
          <p className="font-normal text-[16px] leading-[140%] text-[#E0E0E0]">
            Enter your email address and we’ll send you instructions to reset your password.
          </p>
        </div>

        {/* Toggles List Area */}
        <div className="flex flex-col w-full gap-[20px] mt-[20px]">
          
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="flex flex-col w-full gap-[20px]">
              {/* List Item */}
              <div className="flex items-center justify-between w-full relative h-[81px]">
                
                {/* Text Content */}
                <div className="flex flex-col gap-[10px] absolute left-0 top-0 w-[calc(100%-60px)] md:w-[263px]">
                  <h3 className="font-medium text-[14px] leading-[21px] text-white">
                    Enable All Notifications
                  </h3>
                  <p className="font-normal text-[12px] leading-[22px] text-[#E0E0E0]">
                    Lorem ipsum dolor sit amet consectetur. Diam aliquet lectus laoreet enim faucibus vitae facilisi.
                  </p>
                </div>
                
                {/* Toggle Switch */}
                <div className="absolute right-0 top-[28.5px]">
                  <Switch 
                    checked={toggles[index]}
                    onCheckedChange={() => handleToggle(index)}
                    className="w-[42px] h-[24px] data-checked:bg-[#2186FF] data-unchecked:bg-white/16 border-none [&>span]:bg-white"
                  />
                </div>
              </div>
              
              {/* Divider Line (Except for last item) */}
              {index < 3 && (
                <div className="w-full border-t border-white/15" />
              )}
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
