"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { DashboardHeader } from "@/components/common/dashboard-header";

export default function TermsAndConditionsPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen relative overflow-hidden bg-gradient-to-b from-[#034593] to-[#01152D]">
      
      {/* Background Vectors */}
      <div className="absolute left-[calc(50%-451.09px/2-738.45px)] top-[-189px] w-[451.09px] h-[492px] bg-[#2186FF] opacity-45 blur-[203.65px] pointer-events-none" />
      <div className="absolute right-[-206.09px] bottom-[-167px] w-[451.09px] h-[492px] bg-[#2186FF] opacity-45 blur-[203.65px] pointer-events-none" />

      {/* Header */}
      <div className="w-full z-20 relative">
        <DashboardHeader />
      </div>

      {/* Content Container */}
      <div className="flex flex-col w-full max-w-[1440px] px-[50px] mt-[40px] z-10 relative pb-[100px]">
        
        {/* Back Button */}
        <div 
          className="w-[30px] h-[30px] rounded-full bg-white/15 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors mb-[30px]" 
          onClick={() => router.back()}
        >
          <ChevronLeft className="w-[18px] h-[18px] text-white" strokeWidth={2} />
        </div>

        <div className="flex flex-col gap-[25px] w-full max-w-[1340px]">
          <h1 className="font-semibold text-[40px] leading-[60px] tracking-[-0.025em] text-white">
            Terms and Conditions
          </h1>

          {/* Paragraphs */}
          {Array(9).fill(0).map((_, i) => (
            <p key={i} className="font-normal text-[16px] leading-[140%] text-[#E0E0E0]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non eleifend odio, suscipit aliquam erat. Quisque eu fermentum tortor. Nunc efficitur dictum finibus. Integer lorem lacus, sodales ut interdum vitae, tempus non mi. Sed mollis vehicula nulla id iaculis. In hac habitasse platea dictumst. Vivamus eget tellus sollicitudin, aliquam ligula quis, euismod massa. Morbi iaculis sit amet metus ut condimentum. Maecenas scelerisque lacus sodales posuere sollicitudin. Vivamus accumsan purus mauris, a placerat sapien porta vitae.
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
