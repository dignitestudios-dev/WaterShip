"use client";

import { Stepper, StepCard } from "@/features/dashboard";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useOnboardingProgress } from "@/features/onboarding/api/onboarding.queries";
import { Skeleton } from "@/components/ui/skeleton";

function DashboardContent() {
  const router = useRouter();

  const { data: progressResponse, isLoading } = useOnboardingProgress();
  const rawData: any = progressResponse?.data;
  const onboardingData = rawData?.onboarding || rawData;

  // Step 1: Questionnaire
  const questionnaireStatus = onboardingData?.questionnaire?.status;
  const isQuestionnaireCompleted = questionnaireStatus === "completed";
  const completedSubstepsRaw = onboardingData?.questionnaire?.completedSubsteps;
  const completedCount = typeof completedSubstepsRaw === "number"
    ? completedSubstepsRaw
    : Array.isArray(completedSubstepsRaw)
      ? completedSubstepsRaw.length
      : isQuestionnaireCompleted
        ? 4
        : 0;
  const totalQuestionnaireSteps = onboardingData?.questionnaire?.totalSubsteps || 4;
  const questionnaireProgress = isQuestionnaireCompleted
    ? 100
    : Math.round((completedCount / totalQuestionnaireSteps) * 100);
  const questionnaireSubtitle = isQuestionnaireCompleted
    ? `${totalQuestionnaireSteps} of ${totalQuestionnaireSteps} steps completed`
    : `${completedCount} of ${totalQuestionnaireSteps} steps completed`;

  // Step 2: Risk Assessment
  const isRiskAssessmentCompleted = onboardingData?.riskAssessment?.status === "completed";
  const riskProgress = isRiskAssessmentCompleted ? 100 : 0;
  const riskSubtitle = isRiskAssessmentCompleted
    ? "Completed"
    : "Start Risk Assessment";
  const riskBadge: "completed" | "incomplete" | undefined = isRiskAssessmentCompleted
    ? "completed"
    : "incomplete";

  // Step 3: Document Upload
  const uploadedDocuments = onboardingData?.documentUpload?.uploadedDocuments || [];
  const uploadedCount = onboardingData?.documentUpload?.uploadedCount ?? uploadedDocuments.length;
  const totalRequiredDocs = onboardingData?.documentUpload?.totalRequiredCount || 4;
  const isDocumentUploadCompleted =
    onboardingData?.documentUpload?.status === "completed" ||
    (uploadedCount >= totalRequiredDocs && totalRequiredDocs > 0);
  const documentProgress = isDocumentUploadCompleted
    ? 100
    : isRiskAssessmentCompleted
      ? Math.round((uploadedCount / totalRequiredDocs) * 100)
      : 0;
  const documentSubtitle = isDocumentUploadCompleted
    ? `${totalRequiredDocs} of ${totalRequiredDocs} steps completed`
    : isRiskAssessmentCompleted
      ? `${uploadedCount} of ${totalRequiredDocs} steps completed`
      : "0 of 4 steps completed";

  // Step 4: Appointment Booking
  const isAppointmentBooked =
    onboardingData?.appointmentBooking?.status === "completed" ||
    onboardingData?.booking?.status === "completed";
  const appointmentProgress = isAppointmentBooked ? 100 : 0;
  const appointmentSubtitle = isAppointmentBooked
    ? "Your Session has been booked"
    : isDocumentUploadCompleted
      ? "Start Book Appointment"
      : "0 of 4 steps completed";

  // Overall Percent
  const overallPercent = onboardingData?.overallPercent ?? (
    isAppointmentBooked
      ? 100
      : isDocumentUploadCompleted
        ? 75
        : isRiskAssessmentCompleted
          ? 50
          : isQuestionnaireCompleted
            ? 25
            : 0
  );

  if (isLoading) {
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
        isQuestionnaireCompleted={isQuestionnaireCompleted} 
        isRiskAssessmentCompleted={isRiskAssessmentCompleted} 
        isDocumentUploadCompleted={isDocumentUploadCompleted}
        isAppointmentBooked={isAppointmentBooked}
        overallPercent={overallPercent}
      />

      {/* Grid of Steps */}
      <div className="w-full max-w-[701px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-[15px] gap-y-[15px]">
        {/* Step 1 */}
        <StepCard
          stepNumber={1}
          title="Step 01: Questionnaire"
          subtitle={questionnaireSubtitle}
          progress={questionnaireProgress}
          isFullyCompleted={isQuestionnaireCompleted}
          onClick={() => router.push(isQuestionnaireCompleted ? "/dashboard/questionnaire/completed" : "/dashboard/questionnaire/start")}
        />
        
        {/* Step 2 */}
        <StepCard
          stepNumber={2}
          title="Step 02: Risk Assessment"
          subtitle={riskSubtitle}
          progress={riskProgress}
          badge={riskBadge}
          isFullyCompleted={isRiskAssessmentCompleted}
          onClick={() => isRiskAssessmentCompleted ? undefined : router.push("/dashboard/risk-assessment")}
        />

        {/* Step 3 */}
        <StepCard
          stepNumber={3}
          title="Step 03: Document Upload"
          subtitle={documentSubtitle}
          progress={documentProgress}
          isFullyCompleted={isDocumentUploadCompleted}
          onClick={() => isRiskAssessmentCompleted ? router.push("/dashboard/document-upload") : undefined}
        />

        {/* Step 4 */}
        <StepCard
          stepNumber={4}
          title="Step 04: Appointment Booking"
          subtitle={appointmentSubtitle}
          progress={appointmentProgress}
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
