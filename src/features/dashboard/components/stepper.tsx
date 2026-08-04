import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepperProps {
  isQuestionnaireCompleted?: boolean;
  isRiskAssessmentCompleted?: boolean;
  isDocumentUploadCompleted?: boolean;
  isAppointmentBooked?: boolean;
}

export const Stepper = ({ isQuestionnaireCompleted = false, isRiskAssessmentCompleted = false, isDocumentUploadCompleted = false, isAppointmentBooked = false }: StepperProps) => {
  // Determine active step based on completion statuses.
  let activeStepId = 1;
  let progressPercentage = "0%";

  if (isQuestionnaireCompleted) { activeStepId = 2; progressPercentage = "25%"; }
  if (isRiskAssessmentCompleted) { activeStepId = 3; progressPercentage = "50%"; }
  if (isDocumentUploadCompleted) { activeStepId = 4; progressPercentage = "75%"; }
  if (isAppointmentBooked) { activeStepId = 5; progressPercentage = "100%"; }

  const steps = [
    { id: 1, label: "Questionnaire", left: 99 },
    { id: 2, label: "Risk Assessment", left: 280 },
    { id: 3, label: "Document Upload", left: 457 },
    { id: 4, label: "Book Appointment", left: 634 },
  ];

  return (
    <div className="w-full max-w-[809px] h-[52px] mx-auto mt-[40px] mb-[60px] relative">
      {/* Connecting lines */}
      <div className="absolute top-[19px] left-[0px] w-[90px] border-t-[2.45px] border-white" />
      <div className={cn("absolute top-[19px] left-[130px] w-[145px] border-t-[2.45px] border-white transition-opacity", isQuestionnaireCompleted ? "opacity-100" : "opacity-45")} />
      <div className={cn("absolute top-[19px] left-[307px] w-[145px] border-t-[2.45px] border-white transition-opacity", isRiskAssessmentCompleted ? "opacity-100" : "opacity-45")} />
      <div className={cn("absolute top-[19px] left-[484px] w-[145px] border-t-[2.45px] border-white transition-opacity", isDocumentUploadCompleted ? "opacity-100" : "opacity-45")} />
      <div className={cn("absolute top-[19px] left-[661px] w-[90px] border-t-[2.45px] border-white transition-opacity", isAppointmentBooked ? "opacity-100" : "opacity-45")} />

      {/* Progress Pill */}
      <div className="absolute top-[7px] right-[0px] w-[48px] h-[25.22px] bg-white/12 rounded-[76px] flex items-center justify-center">
        <span className="font-semibold text-[14px] leading-[21px] text-white tracking-[-0.01em]">
          {progressPercentage}
        </span>
      </div>

      {/* Steps */}
      {steps.map((step) => {
        const isCompleted = activeStepId > step.id;
        const isActive = activeStepId === step.id;

        return (
          <div key={step.id}>
            {/* Halo for active step */}
            {isActive && (
              <div 
                className="absolute w-[30px] h-[30px] bg-white opacity-20 rounded-full"
                style={{ left: `${step.left - 4}px`, top: '4px' }}
              />
            )}

            {/* Node */}
            <div 
              className={cn(
                "absolute w-[22px] h-[22px] rounded-full flex items-center justify-center transition-all",
                (isActive || isCompleted) ? "bg-white" : "border-[1.22px] border-white bg-transparent"
              )}
              style={{ left: `${step.left}px`, top: '8px' }}
            >
              {isCompleted ? (
                <Check className="w-[12px] h-[12px] text-[#034593]" strokeWidth={4} />
              ) : (
                <div className={cn("font-bold text-[13px] leading-[20px] tracking-[-0.01em]", isActive ? "text-[#034593]" : "text-white")}>
                  {step.id}
                </div>
              )}
            </div>

            {/* Label centered under node */}
            <div 
              className="absolute flex justify-center w-[150px] top-[40px]"
              style={{ left: `${step.left - 64}px` }}
            >
              <span className={cn(
                "font-normal text-[12.73px] leading-[19px] tracking-[-0.01em] text-center",
                (isActive || isCompleted) ? "text-[#E0E0E0] opacity-100" : "text-[#E0E0E0] opacity-45"
              )}>
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
