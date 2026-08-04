import { ReviewConfirmationForm } from "@/features/questionnaire/components/review-confirmation-form";

export default function QuestionnaireStep4Page() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col ">
      {/* 
        The top nav and background are handled globally by layout.tsx
        so we just inject our form into the main content area 
      */}
      <div className="w-full flex justify-center z-10 ">
        <ReviewConfirmationForm />
      </div>
    </div>
  );
}
