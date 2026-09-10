"use client";

import { useRouter } from "next/navigation";
import { HelpCircle, ChevronLeft } from "lucide-react";
import { useProgressStore } from "../store/progress.store";
import { useState, useEffect } from "react";
import { useOnboardingProgress, isAllOnboardingComplete } from "@/features/onboarding";

export const QuestionnaireIntro = () => {
  const router = useRouter();

  // Hydration fix
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { data: progressResponse } = useOnboardingProgress();
  const rawData: any = progressResponse?.data;
  const onboardingData = rawData?.onboarding || rawData;
  const questionnaire = onboardingData?.questionnaire;
  const isAllStepsCompleted = isAllOnboardingComplete(onboardingData);

  useEffect(() => {
    if (mounted && isAllStepsCompleted) {
      router.replace("/dashboard/questionnaire/completed");
    }
  }, [mounted, isAllStepsCompleted, router]);

  const rawCompleted = questionnaire?.completedSubsteps;
  const serverCompletedSubsteps: number[] = Array.isArray(rawCompleted)
    ? rawCompleted.filter((n: any) => typeof n === "number" && n > 0)
    : typeof rawCompleted === "number" && rawCompleted > 0
      ? Array.from({ length: rawCompleted }, (_, i) => i + 1)
      : [];

  const completedCount = serverCompletedSubsteps.length;
  const isServerComplete = questionnaire?.status === "completed";
  const currentSubstep =
    typeof questionnaire?.currentSubstep === "number" && questionnaire.currentSubstep > 0
      ? questionnaire.currentSubstep
      : 1;

  const hasAnswers = Array.isArray(questionnaire?.answers) && questionnaire.answers.length > 0;

  // A questionnaire is resumable only if there is genuine progress on the account
  const isResume =
    !isServerComplete &&
    (completedCount > 0 || currentSubstep > 1 || hasAnswers);

  const startStepNumber = isServerComplete
    ? 1
    : completedCount > 0
      ? Math.max(...serverCompletedSubsteps) + 1
      : currentSubstep > 1
        ? currentSubstep
        : 1;

  const handleStart = () => {
    if (isAllStepsCompleted) {
      router.push("/dashboard/questionnaire/completed");
      return;
    }

    if (isServerComplete) {
      router.push("/dashboard/questionnaire/form?step=1");
      return;
    }

    if (isResume && startStepNumber > 1) {
      router.push(`/dashboard/questionnaire/form?step=${startStepNumber}`);
    } else {
      router.push("/dashboard/questionnaire/form?step=1");
    }
  };

  if (!mounted) {
    return <div className="w-full min-h-screen bg-gradient-to-b from-[#034593] to-[#01152D]" />;
  }

  return (
    <div className="w-full min-h-screen relative overflow-hidden flex items-center justify-center bg-gradient-to-b from-[#034593] to-[#01152D]">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute left-6 md:left-12 lg:left-[130px] top-8 md:top-10 w-[32px] h-[32px] rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition cursor-pointer z-50"
        title="Go back"
      >
        <ChevronLeft className="w-5 h-5 text-white" strokeWidth={2.5} />
      </button>

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
            {isServerComplete
              ? "Edit Your Questionnaire"
              : isResume
                ? "Resume Your Questionnaire"
                : "Start Your Questionnaire"}
          </h2>
          <p className="text-[#E0E0E0] font-normal text-[14px] leading-[21px] text-center">
            {isServerComplete
              ? "Review and update any of your previously submitted answers."
              : isResume
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
            {isServerComplete ? "Edit Responses" : isResume ? "Resume Now" : "Start Now"}
          </span>
        </button>
      </div>
    </div>
  );
};
