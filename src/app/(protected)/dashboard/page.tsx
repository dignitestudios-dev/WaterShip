"use client";

import { Stepper, StepCard } from "@/features/dashboard";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useOnboardingProgress } from "@/features/onboarding/api/onboarding.queries";
import { Skeleton } from "@/components/ui/skeleton";

function DashboardContent() {
  const router = useRouter();

  const { data: progressResponse, isLoading } = useOnboardingProgress();
  const onboardingData = progressResponse?.data;

  const isCompleted = onboardingData?.questionnaire?.status === "completed";
  const completedSubsteps = onboardingData?.questionnaire?.completedSubsteps || [];
  const maxUnlockedStep = isCompleted ? 5 : (completedSubsteps.length > 0 ? Math.max(...completedSubsteps) + 1 : 1);
  
  const isRiskAssessmentCompleted = onboardingData?.riskAssessment?.status === "completed";
  
  const uploadedDocuments = onboardingData?.documentUpload?.uploadedDocuments || [];
  const numUploaded = uploadedDocuments.length;
  const isDocumentUploadCompleted = onboardingData?.documentUpload?.status === "completed" || numUploaded === 4;

  const isAppointmentBooked = onboardingData?.booking?.status === "completed";
  const progress = isCompleted ? 100 : Math.round(((maxUnlockedStep - 1) / 4) * 100);
  const subtitle = isCompleted ? "Completed" : `${maxUnlockedStep - 1} of 4 steps completed`;

  if ( isLoading) {
    return (
      <div className="flex flex-col items-center justify-start w-full min-h-full py-10 px-4">
        <Skeleton className="w-full max-w-[701px] h-20 mb-8 rounded-full bg-white/10" />
        <div className="w-full max-w-[701px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-[15px] gap-y-[15px]">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="w-full h-[140px] rounded-[18px] bg-white/10" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-full py-10 px-4">
      {/* Stepper Navigation */}
      <Stepper 
        isQuestionnaireCompleted={isCompleted} 
        isRiskAssessmentCompleted={isRiskAssessmentCompleted} 
        isDocumentUploadCompleted={isDocumentUploadCompleted}
        isAppointmentBooked={isAppointmentBooked}
      />

      {/* Grid of Steps */}
      <div className="w-full max-w-[701px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-[15px] gap-y-[15px]">
        {/* Step 1 */}
        <StepCard
          stepNumber={1}
          title="Step 01: Questionnaire"
          subtitle={isCompleted ? "4 of 4 steps completed" : `${maxUnlockedStep - 1} of 4 steps completed`}
          progress={progress}
          isFullyCompleted={isCompleted}
          onClick={() => router.push(isCompleted ? "/dashboard/questionnaire/completed" : "/dashboard/questionnaire/start")}
        />
        
        {/* Step 2 */}
        <StepCard
          stepNumber={2}
          title="Step 02: Risk Assessment"
          subtitle={isRiskAssessmentCompleted ? "Start Risk Assessment" : "Start Risk Assessment"}
          progress={isRiskAssessmentCompleted ? 100 : 0}
          badge={isRiskAssessmentCompleted ? "completed" : "incomplete"}
          isFullyCompleted={isRiskAssessmentCompleted}
          onClick={() => router.push("/dashboard/risk-assessment")}
        />

        {/* Step 3 */}
        <StepCard
          stepNumber={3}
          title="Step 03: Document Upload"
          subtitle={
            isDocumentUploadCompleted 
              ? "4 of 4 steps completed" 
              : (isRiskAssessmentCompleted && numUploaded > 0)
                ? `${numUploaded} of 4 steps completed`
                : isRiskAssessmentCompleted 
                  ? "Start Document Upload" 
                  : "0 of 4 steps completed"
          }
          progress={isRiskAssessmentCompleted ? Math.round((numUploaded / 4) * 100) : 0}
          isFullyCompleted={isDocumentUploadCompleted}
          onClick={() => router.push("/dashboard/document-upload")}
        />

        {/* Step 4 */}
        <StepCard
          stepNumber={4}
          title="Step 04: Appointment Booking"
          subtitle={isAppointmentBooked ? "Your Session has been booked" : isDocumentUploadCompleted ? "Start Book Appointment" : "0 of 4 steps completed"}
          progress={isAppointmentBooked ? 100 : 0}
          badge={isAppointmentBooked ? "button" : (isDocumentUploadCompleted ? undefined : "incomplete")}
          buttonText="View Details"
          isFullyCompleted={isAppointmentBooked}
          onClick={() => isAppointmentBooked ? router.push("/dashboard/appointment/details") : isDocumentUploadCompleted ? router.push("/dashboard/appointment") : undefined}
        />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="w-full h-full flex items-center justify-center">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
