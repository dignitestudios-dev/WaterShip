"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useQuestions, useOnboardingProgress, useCompleteQuestionnaireStep, useSaveQuestionnaireDraft } from "@/features/onboarding/api/onboarding.queries";
import { QuestionnaireLayout } from "./questionnaire-layout";
import { DynamicFormRenderer } from "./dynamic-form-renderer";
import { Skeleton } from "@/components/ui/skeleton";
import { QuestionnaireSubstep, QuestionnaireAnswer } from "@/features/onboarding/types/onboarding.types";
import { Suspense } from "react";

const DynamicQuestionnaireContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const stepParam = searchParams.get("step");
  
  const { data: questionsResponse, isLoading: isLoadingQuestions } = useQuestions();
  const { data: progressResponse, isLoading: isLoadingProgress } = useOnboardingProgress();
  const completeMutation = useCompleteQuestionnaireStep();
  const draftMutation = useSaveQuestionnaireDraft();
  
  const isLoading = isLoadingQuestions || isLoadingProgress;
  
  const substeps: QuestionnaireSubstep[] = questionsResponse?.data || [];
  const maxStep = substeps.length;
  const currentStep = stepParam ? parseInt(stepParam, 10) : 1;
  const activeSubstep = substeps.find(s => s.substepNumber === currentStep) || substeps[0];

  const formatAnswers = (data: any): QuestionnaireAnswer[] => {
    return Object.keys(data).map(key => ({
      questionId: key,
      value: data[key]
    }));
  };

  const handleComplete = (data: any) => {
    if (!activeSubstep) return;
    completeMutation.mutate({
      substepNumber: activeSubstep.substepNumber,
      answers: formatAnswers(data),
    }, {
      onSuccess: () => {
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
    draftMutation.mutate({
      substepNumber: activeSubstep.substepNumber,
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

  if (!activeSubstep) {
    return (
       <QuestionnaireLayout currentStep={currentStep} totalSteps={maxStep || 4}>
        <div className="text-white mt-10 z-10">No questions configured.</div>
      </QuestionnaireLayout>
    );
  }

  return (
    <QuestionnaireLayout currentStep={currentStep} totalSteps={maxStep}>
      <div className="mt-[50px] text-[#FFFFFF] font-medium text-[14px] leading-[21px] tracking-[-0.01em] uppercase z-10">
        {activeSubstep.title}
      </div>
      <DynamicFormRenderer 
        questions={activeSubstep.questions} 
        onComplete={handleComplete} 
        onSaveDraft={handleSaveDraft}
      />
    </QuestionnaireLayout>
  );
};

export const DynamicQuestionnaire = () => (
  <Suspense fallback={<div className="w-full min-h-screen bg-gradient-to-b from-[#034593] to-[#01152D]" />}>
    <DynamicQuestionnaireContent />
  </Suspense>
);
