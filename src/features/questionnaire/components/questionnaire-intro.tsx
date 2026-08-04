"use client";

import { useRouter } from "next/navigation";
import { HelpCircle } from "lucide-react";
import { useProgressStore } from "../store/progress.store";
import { useState, useEffect } from "react";

export const QuestionnaireIntro = () => {
  const router = useRouter();
  
  // Hydration fix
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  const maxUnlockedStep = useProgressStore((state) => state.maxUnlockedStep);
  const isCompleted = useProgressStore((state) => state.isCompleted);

  const handleStart = () => {
    if (isCompleted) {
      router.push("/dashboard/questionnaire/completed");
      return;
    }
    
    switch (maxUnlockedStep) {
      case 1: router.push("/dashboard/questionnaire/form"); break;
      case 2: router.push("/dashboard/questionnaire/step-2"); break;
      case 3: router.push("/dashboard/questionnaire/step-3"); break;
      case 4: router.push("/dashboard/questionnaire/step-4"); break;
      default: router.push("/dashboard/questionnaire/form");
    }
  };

  if (!mounted) {
    return <div className="w-full min-h-screen bg-gradient-to-b from-[#034593] to-[#01152D]" />;
  }

  return (
    <div className="w-full min-h-screen relative overflow-hidden flex items-center justify-center bg-gradient-to-b from-[#034593] to-[#01152D]">
      
      {/* Background Blobs */}
      <div className="absolute -top-[189px] left-[calc(50%-451px/2-738px)] w-[451px] h-[492px] bg-[#2186FF] opacity-45 blur-[203px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-[167px] right-[-206px] w-[451px] h-[492px] bg-[#2186FF] opacity-45 blur-[203px] rounded-full pointer-events-none" />

      {/* Cross line in background */}
      <div className="absolute top-[332px] left-[179px] w-[64px] border-t border-[rgba(114,114,114,0.15)] transform rotate-90" />

      {/* Main Content Box */}
      <div className="flex flex-col items-center justify-between w-[343px] h-[296px] relative z-10">
        
        {/* Icon Circle */}
        <div className="w-[79px] h-[79px] bg-white/15 rounded-full flex items-center justify-center shadow-sm">
          <HelpCircle className="w-[30px] h-[30px] text-white" strokeWidth={2.5} />
        </div>

        {/* Text Area */}
        <div className="flex flex-col items-center gap-[25px] w-[313px]">
          <h2 className="text-white font-semibold text-[26px] leading-[39px] tracking-[-0.025em] text-center">
            {maxUnlockedStep > 1 ? "Resume Your Questionnaire" : "Start Your Questionnaire"}
          </h2>
          <p className="text-[#E0E0E0] font-normal text-[14px] leading-[21px] text-center">
            {maxUnlockedStep > 1 
              ? "Pick up where you left off to help us understand your financial profile." 
              : "Complete a few simple steps to help us understand your financial profile and guide your onboarding."}
          </p>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="w-[343px] h-[42px] bg-gradient-to-r from-[#2186FF] to-[#145199] rounded-[72px] flex items-center justify-center transition-opacity hover:opacity-90"
        >
          <span className="text-white font-medium text-[14px] leading-[21px] text-center">
            {maxUnlockedStep > 1 ? "Resume Now" : "Start Now"}
          </span>
        </button>

      </div>
    </div>
  );
};
