import { ApiResponse } from "@/features/auth";

export interface OnboardingStatus {
  status: "not_started" | "in_progress" | "completed";
  overallPercent: number;
  questionnaire: {
    status: string;
    completedSubsteps: number[];
  };
  riskAssessment: {
    status: string;
  };
  documentUpload: {
    status: string;
    uploadedDocuments: any[];
  };
  booking: {
    status: string;
  };
}

export interface QuestionnaireOption {
  label: string;
  value: string;
}

export interface QuestionnaireQuestion {
  questionId: string;
  questionType: "text" | "date" | "radio" | "checkbox" | "select" | "dropdown" | "chips" | "number";
  text: string;
  required: boolean;
  options?: QuestionnaireOption[];
  conditionalLogic?: {
    dependsOnValue: any;
    questions: QuestionnaireQuestion[];
  }[];
}

export interface QuestionnaireSubstep {
  substepNumber: number;
  title: string;
  description?: string;
  questions: QuestionnaireQuestion[];
}

export interface QuestionnaireAnswer {
  questionId: string;
  value: any;
  conditionalAnswers?: QuestionnaireAnswer[];
}

export interface QuestionnairePayload {
  substepNumber: number;
  answers: QuestionnaireAnswer[];
}

export interface RiskAssessmentPayload {
  thirdPartyReference?: string;
}

export interface DocumentUploadPayload {
  file: File | Blob;
  fileName: string;
  type: string;
}

export interface DocumentRequirement {
  code: string;
  title: string;
  required: boolean;
}

export interface BookingPayload {
  bookingDate: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  meetingLocation?: string;
  isTeamsMeetingRequested?: boolean;
  notes?: string;
}
