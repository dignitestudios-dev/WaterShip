"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Check } from "lucide-react";
import { useEffect } from "react";
import { useProgressStore } from "@/features/questionnaire/store/progress.store";

export default function QuestionnaireCompletedPage() {
  const router = useRouter();
  const isCompleted = useProgressStore((state) => state.isCompleted);

  // Redirect if they somehow land here without completing
  useEffect(() => {
    if (!isCompleted) {
      router.replace("/dashboard");
    }
  }, [isCompleted, router]);

  if (!isCompleted) return null;

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#034593] to-[#01152D] relative overflow-hidden flex flex-col items-center">
      
      {/* Background Blobs */}
      <div className="absolute -top-[189px] left-[calc(50%-451px/2-738px)] w-[451px] h-[492px] bg-[#2186FF] opacity-45 blur-[203px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-[170px] right-[-206px] w-[451px] h-[492px] bg-[#2186FF] opacity-45 blur-[203px] rounded-full pointer-events-none" />
      
      {/* Back Button */}
      <div className="absolute top-[30px] sm:top-[130px] left-[30px] sm:left-[calc(50%-400px)] z-20">
        <button 
          onClick={() => router.push("/dashboard")} 
          className="w-[30px] h-[30px] rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition"
        >
          <ChevronLeft className="w-4 h-4 text-white" strokeWidth={3} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center z-10 w-full max-w-[441px] px-4 -mt-20">
        
        {/* Check Icon */}
        <div className="w-[79.49px] h-[79.49px] bg-white/15 rounded-full flex items-center justify-center mb-[25px]">
          <Check className="w-10 h-10 text-white" strokeWidth={3.5} />
        </div>
        
        <h1 className="text-white font-semibold text-[26px] leading-[39px] tracking-[-0.025em] text-center mb-[10px]">
          Your Questionnaire Has been<br />Submitted!
        </h1>
        
        <p className="text-[#E0E0E0] font-normal text-[14px] leading-[21px] text-center w-full max-w-[397px]">
          Your responses have been recorded. Our team will review your questionnaire and get back to you shortly.
        </p>

      </div>
      
    </div>
  );
}
