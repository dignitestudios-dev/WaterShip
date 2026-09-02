"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Lock, CheckCircle2, ExternalLink, Check, Loader2 } from "lucide-react";
import { useProgressStore } from "@/features/questionnaire/store/progress.store";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useOnboardingProgress, useCompleteRiskAssessment } from "@/features/onboarding/api/onboarding.queries";

export default function RiskAssessmentPage() {
  const router = useRouter();
  
  // Hydration fix
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  const { data: progressResponse } = useOnboardingProgress();
  const completeMutation = useCompleteRiskAssessment();
  const rawData: any = progressResponse?.data;
  const onboardingData = rawData?.onboarding || rawData;
  
  const isQuestionnaireCompleted = 
    onboardingData?.questionnaire?.status === "completed" || 
    useProgressStore((state) => state.isCompleted);
  const isRiskAssessmentCompleted = 
    onboardingData?.riskAssessment?.status === "completed" || 
    useProgressStore((state) => state.isRiskAssessmentCompleted);
  const isLocked = !isQuestionnaireCompleted;
  const setRiskAssessmentCompleted = useProgressStore((state) => state.setRiskAssessmentCompleted);

  const [submitState, setSubmitState] = useState<'idle' | 'confirm' | 'submitting' | 'success'>('idle');

  useEffect(() => {
    if (mounted && isRiskAssessmentCompleted && submitState === 'idle') {
      router.replace("/dashboard");
    }
  }, [mounted, isRiskAssessmentCompleted, router, submitState]);

  if (!mounted || isRiskAssessmentCompleted) {
    return <div className="w-full min-h-screen bg-gradient-to-b from-[#034593] to-[#01152D]" />;
  }

  const handleSave = () => {
    setSubmitState('submitting');
    completeMutation.mutate({}, {
      onSuccess: () => {
        setRiskAssessmentCompleted(true);
        setSubmitState('success');
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      },
      onError: () => {
        setSubmitState('idle');
      }
    });
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#034593] to-[#01152D] relative overflow-hidden flex flex-col items-center pb-20">
      
      {/* Background Blobs */}
      <div className="absolute -top-[189px] left-[calc(50%-451px/2-738px)] w-[451px] h-[492px] bg-[#2186FF] opacity-45 blur-[203px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-[170px] right-[-206px] w-[451px] h-[492px] bg-[#2186FF] opacity-45 blur-[203px] rounded-full pointer-events-none" />
      
      {/* Top Header / Progress */}
      <div className="w-[799px] max-w-full flex flex-col items-center mt-[130px] z-10 relative">
        <button 
          onClick={() => router.back()} 
          className="absolute left-[0px] md:left-[-200px] top-[0px] w-[30px] h-[30px] rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition"
        >
          <ChevronLeft className="w-4 h-4 text-white" strokeWidth={3} />
        </button>

        {!isLocked && (
          <>
            <h1 className="text-white font-semibold text-[40px] leading-[60px] tracking-[-0.025em] text-center">
              Risk Assessment
            </h1>
            <p className="text-[#E0E0E0] font-normal text-[16px] leading-[140%] text-center mt-[25px]">
              Complete your risk profile in a secure external assessment.
            </p>

       
          </>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={isLocked ? "locked" : "active"}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full flex flex-col items-center justify-center"
        >
          {isLocked ? (
            <div className="flex flex-col items-center justify-center mt-[100px] z-10">
              <div className="w-[79.49px] h-[79.49px] bg-white/15 rounded-full flex items-center justify-center mb-[25px]">
                <Lock className="w-10 h-10 text-white" strokeWidth={2.5} />
              </div>
              <h1 className="text-white font-semibold text-[26px] leading-[39px] tracking-[-0.025em] text-center mb-[10px]">
                Finish Earlier Steps First
              </h1>
              <p className="text-[#E0E0E0] font-normal text-[14px] leading-[21px] text-center">
                This step will become available once Step 1 is completed.
              </p>
            </div>
          ) : (
            <div className="mt-[50px] z-10 w-[513px] max-w-[95vw] flex flex-col items-center">
              
              {/* Blue Card */}
              <div className="w-full bg-[#2186FF] border border-[rgba(40,159,44,0.16)] rounded-[17px] p-[24px] flex flex-col gap-[15px]">
                <span className="text-[#DDEBF8] font-medium text-[14px] leading-[21px] tracking-[-0.01em] uppercase">
                  Powered by Nitrogen
                </span>
                <h2 className="text-white font-medium text-[16px] leading-[24px] tracking-[-0.01em]">
                  Risk Profiling Assessment
                </h2>
                <p className="text-[#E0E0E0] font-medium text-[14px] leading-[21px] tracking-[-0.01em]">
                  A science-based questionnaire to understand your risk tolerance.
                </p>
              </div>

              {/* Checklist */}
              <div className="w-full mt-[30px] flex flex-col gap-[11px] px-[24px]">
                <div className="flex items-center gap-[8px]">
                  <CheckCircle2 className="w-4 h-4 text-[#2186FF]" />
                  <span className="text-[#E0E0E0] font-medium text-[12px] leading-[18px]">
                    Takes ~5 minutes
                  </span>
                </div>
                <div className="flex items-center gap-[8px]">
                  <CheckCircle2 className="w-4 h-4 text-[#2186FF]" />
                  <span className="text-[#E0E0E0] font-medium text-[12px] leading-[18px]">
                    Secure external platform
                  </span>
                </div>
                <div className="flex items-center gap-[8px]">
                  <CheckCircle2 className="w-4 h-4 text-[#2186FF]" />
                  <span className="text-[#E0E0E0] font-medium text-[12px] leading-[18px]">
                    Results shared with your advisor
                  </span>
                </div>
              </div>

              {/* Button */}
              <button 
                onClick={() => setSubmitState('confirm')}
                className="w-full mt-[30px] h-[42px] bg-gradient-to-br from-[#2186FF] to-[rgba(33,134,255,0.15)] rounded-[96px] flex items-center justify-center gap-[10px] hover:opacity-90 transition"
              >
                <ExternalLink className="w-4 h-4 text-white" />
                <span className="text-white font-medium text-[14px] leading-[21px] text-center">
                  Start Risk Assessment
                </span>
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Popups */}
      <Dialog 
        open={submitState !== 'idle'} 
        onOpenChange={(open) => {
          if (!open && submitState === 'confirm') {
            setSubmitState('idle');
          }
        }}
      >
        <DialogContent 
          className="border-none w-[343px] h-[338px] p-0 rounded-[32px] overflow-hidden bg-transparent shadow-none" 
          showCloseButton={false}
        >
          <div className="w-full h-full bg-gradient-to-b from-[#034593] to-[#01152D] shadow-[0px_4px_30px_rgba(33,134,255,0.15)] flex flex-col items-center justify-center relative p-4">
            
            {submitState === 'confirm' && (
              <>
                <div className="w-[67px] h-[67px] bg-white/15 rounded-full flex items-center justify-center mb-[15px]">
                  <Check className="w-[40px] h-[35px] text-white" strokeWidth={3} />
                </div>
                <h2 className="font-semibold text-[22px] leading-[22px] text-center text-white mb-[15px] max-w-[289px]">
                  You'll be redirected securely
                </h2>
                <p className="font-normal text-[13px] leading-[160%] text-center text-[#E0E0E0] mb-[30px] max-w-[243px]">
                  You will return automatically after completion.
                </p>
                <div className="flex gap-[5px]">
                  <button 
                    onClick={() => setSubmitState('idle')}
                    className="flex justify-center items-center w-[142px] h-[51px] bg-white/15 rounded-[73px] text-white font-medium text-[14px] hover:bg-white/20 transition"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    className="flex justify-center items-center w-[142px] h-[51px] bg-gradient-to-br from-[#2186FF] to-[rgba(33,134,255,0.15)] rounded-[73px] text-white font-medium text-[14px] hover:opacity-90 transition"
                  >
                    Continue
                  </button>
                </div>
              </>
            )}

            {submitState === 'submitting' && (
              <>
                <div className="w-[67px] h-[67px] flex items-center justify-center mb-[15px]">
                  <Loader2 className="w-[60px] h-[60px] text-white animate-spin" strokeWidth={2} />
                </div>
                <h2 className="font-semibold text-[22px] leading-[33px] text-center text-white mb-[15px]">
                  Updating Risk<br/>Assessment Status
                </h2>
                <p className="font-normal text-[13px] leading-[160%] text-center text-[#E0E0E0] max-w-[250px]">
                  The system is updating your assessment status.
                </p>
              </>
            )}

            {submitState === 'success' && (
              <>
                <div className="w-[67px] h-[67px] bg-white/15 rounded-full flex items-center justify-center mb-[15px]">
                  <Check className="w-[40px] h-[35px] text-white" strokeWidth={3} />
                </div>
                <h2 className="font-semibold text-[22px] leading-[33px] text-center text-white mb-[15px]">
                  Submission Received
                </h2>
                <p className="font-normal text-[13px] leading-[160%] text-center text-[#E0E0E0] max-w-[250px]">
                  Your risk assessment has been recorded successfully.
                </p>
              </>
            )}

          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
