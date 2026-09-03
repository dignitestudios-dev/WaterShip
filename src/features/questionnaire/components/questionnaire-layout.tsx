"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Lock } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { useProgressStore } from "../store/progress.store";
import { cn } from "@/lib/utils";

import { useOnboardingProgress } from "@/features/onboarding/api/onboarding.queries";

interface QuestionnaireLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps?: number;
}

export const QuestionnaireLayout = ({
  children,
  currentStep,
  totalSteps = 4,
}: QuestionnaireLayoutProps) => {
  const router = useRouter();
  const { data: progressResponse } = useOnboardingProgress();
  const rawData: any = progressResponse?.data;
  const onboardingData = rawData?.onboarding || rawData;
  const questionnaire = onboardingData?.questionnaire;

  const rawCompleted = questionnaire?.completedSubsteps;
  const serverCompletedSubsteps: number[] = Array.isArray(rawCompleted)
    ? rawCompleted.filter((n: any) => typeof n === "number" && n > 0)
    : typeof rawCompleted === "number" && rawCompleted > 0
      ? Array.from({ length: rawCompleted }, (_, i) => i + 1)
      : [];
  const isServerComplete = questionnaire?.status === "completed";
  const serverUnlockedStep = isServerComplete
    ? totalSteps + 1
    : serverCompletedSubsteps.length > 0
      ? Math.max(...serverCompletedSubsteps) + 1
      : typeof questionnaire?.currentSubstep === "number" && questionnaire.currentSubstep > 0
        ? questionnaire.currentSubstep
        : 1;
  const storeUnlockedStep = useProgressStore((state) => state.maxUnlockedStep);
  const effectiveUnlockedStep = isServerComplete ? totalSteps + 1 : Math.max(serverUnlockedStep, storeUnlockedStep);
  const isLocked = currentStep > effectiveUnlockedStep;

  // We only show progress up to what is unlocked
  const displayStep = isLocked ? effectiveUnlockedStep + 1 : currentStep;
  const progressPercent = Math.round(((displayStep - 1) / totalSteps) * 100);
  
  const count = useMotionValue(progressPercent);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const animation = animate(count, progressPercent, { duration: 0.5 });
    return animation.stop;
  }, [progressPercent, count]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#034593] to-[#01152D] relative overflow-hidden flex flex-col items-center pb-20">
      
      {/* Background Blobs */}
      <div className="absolute -top-[189px] left-[calc(50%-451px/2-738px)] w-[451px] h-[492px] bg-[#2186FF] opacity-45 blur-[203px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-[170px] right-[-206px] w-[451px] h-[492px] bg-[#2186FF] opacity-45 blur-[203px] rounded-full pointer-events-none" />
      
      {/* Top Header / Progress (Wide stepper style) */}
      <div className="w-[799px] max-w-full flex flex-col items-center mt-[130px] z-10 relative">
        <button 
          onClick={() => router.back()} 
          className="absolute left-[-200px] top-[0px] w-[30px] h-[30px] rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 text-white" strokeWidth={3} />
        </button>

        {!isLocked && (
          <>
            <h1 className="text-white font-semibold text-[40px] leading-[60px] tracking-[-0.025em] text-center">
              Financial Questionnaire
            </h1>
            <p className="text-[#E0E0E0] font-normal text-[16px] leading-[140%] text-center mt-[25px] max-w-[683px]">
              Help us understand your financial situation, goals, and preferences. This will only take a few minutes.
            </p>

            {/* Progress Bar Area */}
            <div className="w-full mt-[30px] flex flex-col gap-[10px]">
              {/* Progress Lines */}
              <div className="flex justify-between items-center gap-[6px] w-full">
                {Array.from({ length: totalSteps }).map((_, i) => {
                  const stepNum = i + 1;
                  const isStepAccessible = stepNum <= effectiveUnlockedStep;
                  return (
                    <motion.div
                      key={i}
                      onClick={() => {
                        if (isStepAccessible) {
                          router.push(`/dashboard/questionnaire/form?step=${stepNum}`);
                        }
                      }}
                      initial={false}
                      animate={{
                        borderColor: stepNum <= currentStep ? "#FFFFFF" : "#E0E0E0",
                        opacity: stepNum <= currentStep ? 1 : 0.45,
                      }}
                      transition={{ duration: 0.5 }}
                      className={cn(
                        "flex-1 border-[2px] rounded-full transition-all",
                        isStepAccessible ? "cursor-pointer hover:opacity-100 hover:border-white" : "cursor-default"
                      )}
                      title={isStepAccessible ? `Go to Step ${stepNum}` : `Step ${stepNum} (Locked)`}
                    />
                  );
                })}
              </div>
              
              {/* Progress Text */}
              <div className="flex justify-between items-center w-full">
                <span className="text-[#E0E0E0] font-medium text-[14px] leading-[21px] tracking-[-0.01em]">
                  {currentStep - 1} of {totalSteps} steps completed
                </span>
                <div className="bg-white/12 rounded-[76px] px-[8px] py-[2px] flex items-center justify-center">
                  <span className="text-white font-semibold text-[12px] leading-[18px] tracking-[-0.01em]">
                    <motion.span>{rounded}</motion.span>%
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={isLocked ? "locked" : currentStep}
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
                This step will become available once {Array.from({ length: currentStep - 1 }).map((_, i) => `Step ${i + 1}`).join(' and ')} are completed.
              </p>
            </div>
          ) : (
            children
          )}
        </motion.div>
      </AnimatePresence>
      
    </div>
  );
};
