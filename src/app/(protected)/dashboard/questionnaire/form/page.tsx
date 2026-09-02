import { DynamicQuestionnaire } from "@/features/questionnaire/components/dynamic-questionnaire";

export default function QuestionnaireFormPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      <div className="w-full flex justify-center z-10">
        <DynamicQuestionnaire />
      </div>
    </div>
  );
}
