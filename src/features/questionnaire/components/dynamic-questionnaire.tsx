"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useQuestions, useOnboardingProgress, useCompleteQuestionnaireStep, useSaveQuestionnaireDraft } from "@/features/onboarding/api/onboarding.queries";
import { QuestionnaireLayout } from "./questionnaire-layout";
import { DynamicFormRenderer } from "./dynamic-form-renderer";
import { Skeleton } from "@/components/ui/skeleton";
import { QuestionnaireSubstep, QuestionnaireAnswer } from "@/features/onboarding/types/onboarding.types";
import { Suspense, useMemo } from "react";
import { ClipboardList, HelpCircle, RotateCw } from "lucide-react";

import { useProgressStore } from "../store/progress.store";

const DynamicQuestionnaireContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const stepParam = searchParams.get("step");
  
  const { data: questionsResponse, isLoading: isLoadingQuestions, refetch: refetchQuestions } = useQuestions();
  const { data: progressResponse, isLoading: isLoadingProgress } = useOnboardingProgress();
  const completeMutation = useCompleteQuestionnaireStep();
  const draftMutation = useSaveQuestionnaireDraft();
  
  const isLoading = isLoadingQuestions || isLoadingProgress;
  
  const rawQuestionsData = questionsResponse?.data;
  const substeps: QuestionnaireSubstep[] = Array.isArray(rawQuestionsData)
    ? rawQuestionsData
    : Array.isArray(rawQuestionsData?.substeps)
      ? rawQuestionsData.substeps
      : Array.isArray(rawQuestionsData?.questions)
        ? rawQuestionsData.questions
        : [];

  const maxStep = substeps.length;
  const currentStep = stepParam ? parseInt(stepParam, 10) : 1;
  const activeSubstep = substeps.find(s => (s.stepNumber ?? s.substepNumber) === currentStep) || substeps[0];

  const totalQuestionsCount = substeps.reduce((acc, step) => {
    return acc + (Array.isArray(step.questions) ? step.questions.length : 0);
  }, 0);

  // Extract previously saved answers (from draft or submitted steps) into a key-value dictionary
  const rawData: any = progressResponse?.data;
  const onboardingData = rawData?.onboarding || rawData;
  const savedAnswersList = onboardingData?.questionnaire?.answers || [];

  const savedAnswersMap = useMemo(() => {
    const map: Record<string, any> = {};
    if (!Array.isArray(savedAnswersList)) return map;

    const extract = (item: any) => {
      if (!item || !item.questionId) return;
      map[item.questionId] = item.value;
      if (Array.isArray(item.conditionalAnswers)) {
        item.conditionalAnswers.forEach(extract);
      }
    };

    savedAnswersList.forEach(extract);
    return map;
  }, [savedAnswersList]);

  const formatAnswers = (data: any): QuestionnaireAnswer[] => {
    return Object.keys(data).map(key => ({
      questionId: key,
      value: data[key]
    }));
  };

  const currentStepNumber = activeSubstep?.stepNumber ?? activeSubstep?.substepNumber ?? currentStep;

  const handleComplete = (data: any) => {
    if (!activeSubstep) return;
    completeMutation.mutate({
      substepNumber: currentStepNumber,
      answers: formatAnswers(data),
    }, {
      onSuccess: () => {
        useProgressStore.getState().unlockStep(currentStep + 1);
        if (currentStep < maxStep) {
          router.push(`/dashboard/questionnaire/form?step=${currentStep + 1}`);
        } else {
          router.push("/dashboard/questionnaire/completed");
        }
      }
    });
  };

  const handleSaveDraft = (data: any) => {
    if (!activeSubstep) return;
    const rawCompleted = progressResponse?.data?.questionnaire?.completedSubsteps;
    const completedList: number[] = Array.isArray(rawCompleted)
      ? rawCompleted
      : typeof rawCompleted === "number"
        ? [rawCompleted]
        : [];
    const lastCompleted = completedList.length > 0 
      ? Math.max(...completedList) 
      : Math.max(0, currentStepNumber - 1);

    draftMutation.mutate({
      substepNumber: currentStepNumber,
      currentSubstep: currentStepNumber,
      completedSubstepNumber: lastCompleted,
      answers: formatAnswers(data),
    }, {
      onSuccess: () => {
        router.push("/dashboard");
      }
    });
  };

  if (isLoading) {
    return (
      <QuestionnaireLayout currentStep={currentStep} totalSteps={maxStep || 4}>
        <div className="w-[90%] lg:w-[80%] mt-[30px] z-10 flex flex-col gap-[30px]">
           <Skeleton className="w-1/3 h-[40px] rounded-[7px] bg-white/10" />
           <div className="grid grid-cols-1 md:grid-cols-3 gap-x-[30px] gap-y-[30px] w-full">
             {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="w-full h-[70px] rounded-[7px] bg-white/10" />)}
           </div>
        </div>
      </QuestionnaireLayout>
    );
  }

  // Entire questionnaire has no questions configured
  if (substeps.length === 0 || totalQuestionsCount === 0) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-[#034593] to-[#01152D] relative overflow-hidden flex flex-col items-center justify-center px-4 py-12">
        {/* Background Blobs */}
        <div className="absolute -top-[189px] left-[calc(50%-451px/2-738px)] w-[451px] h-[492px] bg-[#2186FF] opacity-45 blur-[203px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-[170px] right-[-206px] w-[451px] h-[492px] bg-[#2186FF] opacity-45 blur-[203px] rounded-full pointer-events-none" />

        {/* Card */}
        <div className="w-full max-w-[540px] bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-8 md:p-10 flex flex-col items-center text-center z-10 shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2186FF] to-[rgba(33,134,255,0.25)] flex items-center justify-center mb-6 shadow-lg shadow-[#2186FF]/20 ring-4 ring-white/10">
            <ClipboardList className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-white font-semibold text-2xl md:text-3xl tracking-tight mb-3">
            No Questions Available
          </h2>

          <p className="text-[#E0E0E0] text-sm md:text-base leading-relaxed mb-8 max-w-[420px]">
            There are currently no questionnaire steps or questions configured. Please check back shortly or return to your dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#2186FF] hover:bg-[#1a73e8] text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => refetchQuestions()}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/15 hover:bg-white/20 border border-white/20 text-white text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCw className="w-4 h-4" />
              <span>Retry</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active step has no questions configured
  if (!activeSubstep || !Array.isArray(activeSubstep.questions) || activeSubstep.questions.length === 0) {
    return (
      <QuestionnaireLayout currentStep={currentStep} totalSteps={maxStep || 4}>
        <div className="w-full max-w-[540px] bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-8 md:p-10 flex flex-col items-center text-center z-10 mt-10 shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2186FF] to-[rgba(33,134,255,0.2)] flex items-center justify-center mb-5 ring-4 ring-white/10">
            <HelpCircle className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-white font-semibold text-xl md:text-2xl mb-2">
            No Questions Configured
          </h3>
          <p className="text-[#E0E0E0] text-sm leading-relaxed mb-6">
            There are no questions configured for this step yet.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-5 py-2.5 rounded-full bg-[#2186FF] hover:bg-[#1a73e8] text-white text-sm font-semibold transition cursor-pointer"
            >
              Dashboard
            </button>
            {currentStep < maxStep && (
              <button
                onClick={() => router.push(`/dashboard/questionnaire/form?step=${currentStep + 1}`)}
                className="px-5 py-2.5 rounded-full bg-white/15 hover:bg-white/20 border border-white/20 text-white text-sm font-medium transition cursor-pointer"
              >
                Next Step
              </button>
            )}
          </div>
        </div>
      </QuestionnaireLayout>
    );
  }

  return (
    <QuestionnaireLayout currentStep={currentStep} totalSteps={maxStep}>
      <div className="mt-[50px] text-[#FFFFFF] font-medium text-[14px] leading-[21px] tracking-[-0.01em] uppercase z-10">
        {activeSubstep.stepName || activeSubstep.title}
      </div>
      <DynamicFormRenderer 
        key={currentStepNumber}
        questions={activeSubstep.questions} 
        initialValues={savedAnswersMap}
        onComplete={handleComplete} 
        onSaveDraft={handleSaveDraft}
        isSubmitting={completeMutation.isPending}
      />
    </QuestionnaireLayout>
  );
};

export const DynamicQuestionnaire = () => (
  <Suspense fallback={<div className="w-full min-h-screen bg-gradient-to-b from-[#034593] to-[#01152D]" />}>
    <DynamicQuestionnaireContent />
  </Suspense>
);
