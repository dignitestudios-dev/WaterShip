"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Check, Edit3 } from "lucide-react";
import { useEffect } from "react";
import { useProgressStore } from "@/features/questionnaire/store/progress.store";
import { useOnboardingProgress, isAllOnboardingComplete } from "@/features/onboarding";
import { Button } from "@/components/ui/button";

export default function QuestionnaireCompletedPage() {
  const router = useRouter();
  const { data: progressResponse, isLoading } = useOnboardingProgress();
  
  const rawData: any = progressResponse?.data;
  const onboardingData = rawData?.onboarding || rawData;
  const isServerComplete = onboardingData?.questionnaire?.status === "completed";
  const storeComplete = useProgressStore((state) => state.isCompleted);
  const isCompleted = isServerComplete || storeComplete;
  const isAllStepsCompleted = isAllOnboardingComplete(onboardingData);

  // Redirect if not completed and finished loading
  useEffect(() => {
    if (!isLoading && !isCompleted) {
      router.replace("/dashboard");
    }
  }, [isLoading, isCompleted, router]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-[#034593] to-[#01152D] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      </div>
    );
  }

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
          className="w-[30px] h-[30px] rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 text-white" strokeWidth={3} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center z-10 w-full max-w-[441px] px-4 -mt-10">
        
        {/* Check Icon */}
        <div className="w-[79.49px] h-[79.49px] bg-white/15 rounded-full flex items-center justify-center mb-[25px]">
          <Check className="w-10 h-10 text-white" strokeWidth={3.5} />
        </div>
        
        <h1 className="text-white font-semibold text-[26px] leading-[39px] tracking-[-0.025em] text-center mb-[10px]">
          {isAllStepsCompleted ? (
            <>Your Questionnaire is<br />Finalized</>
          ) : (
            <>Your Questionnaire Has been<br />Submitted!</>
          )}
        </h1>
        
        <p className="text-[#E0E0E0] font-normal text-[14px] leading-[21px] text-center w-full max-w-[397px]">
          {isAllStepsCompleted
            ? "All onboarding steps have been successfully completed. Your questionnaire responses are finalized."
            : "Your responses have been recorded. You can edit any of your steps at any time."}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-[12px] w-full max-w-[340px] mt-[35px]">
          {!isAllStepsCompleted && (
            <button
              onClick={() => router.push("/dashboard/questionnaire/form?step=1")}
              className="w-full h-[46px] rounded-[72px] bg-gradient-to-r from-[#2186FF] to-[#145199] text-white font-medium text-[14px] leading-[21px] flex items-center justify-center gap-2 transition-opacity hover:opacity-90 cursor-pointer shadow-lg"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Responses</span>
            </button>
          )}

          <button
            onClick={() => router.push("/dashboard")}
            className="w-full h-[46px] rounded-[72px] bg-white/15 text-white font-medium text-[14px] leading-[21px] flex items-center justify-center transition-colors hover:bg-white/25 cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>

      </div>
      
    </div>
  );
}

