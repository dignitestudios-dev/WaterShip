import { OnboardingStatus } from "../types/onboarding.types";

export const isAllOnboardingComplete = (data?: OnboardingStatus | any): boolean => {
  if (!data) return false;
  const onboarding = data?.onboarding || data;
  if (onboarding?.overallPercent === 100 || onboarding?.status === "completed") {
    return true;
  }
  const isQuestionnaireComplete = onboarding?.questionnaire?.status === "completed";
  const isRiskComplete = onboarding?.riskAssessment?.status === "completed";
  const isDocComplete =
    onboarding?.documentUpload?.status === "completed" ||
    (typeof onboarding?.documentUpload?.uploadedCount === "number" &&
      typeof onboarding?.documentUpload?.totalRequiredCount === "number" &&
      onboarding.documentUpload.totalRequiredCount > 0 &&
      onboarding.documentUpload.uploadedCount >= onboarding.documentUpload.totalRequiredCount);
  const isApptComplete =
    onboarding?.appointmentBooking?.status === "completed" ||
    onboarding?.booking?.status === "completed";

  return Boolean(isQuestionnaireComplete && isRiskComplete && isDocComplete && isApptComplete);
};
