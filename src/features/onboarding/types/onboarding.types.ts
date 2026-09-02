import { ApiResponse } from "@/features/auth";

export interface OnboardingStatus {
  status?: "not_started" | "in_progress" | "completed";
  overallPercent?: number;
  questionnaire?: {
    status: string;
    completedSubsteps?: number | number[];
    currentSubstep?: number;
    totalSubsteps?: number;
    substepsProgress?: any[];
    answers?: any[];
  };
  riskAssessment?: {
    status: string;
    thirdPartyReference?: string | null;
  };
  documentUpload?: {
    status: string;
    uploadedDocuments?: any[];
    uploadedCount?: number;
    totalRequiredCount?: number;
  };
  appointmentBooking?: {
    status: string;
    bookingDate?: string | null;
  };
  booking?: {
    status: string;
  };
}

export interface QuestionnaireOption {
  label: string;
  value: string;
}

export interface QuestionnaireConditionalLogic {
  triggerValue?: any;
  dependsOnValue?: any;
  questions: QuestionnaireQuestion[];
}

export interface QuestionnaireQuestion {
  questionId: string;
  number?: number;
  type: "text" | "date" | "radio" | "checkbox" | "select" | "dropdown" | "chips" | "number" | string;
  text: string;
  required: boolean;
  options?: (string | QuestionnaireOption)[];
  hintText?: string | null;
  conditionalLogic?: QuestionnaireConditionalLogic[];
}

export interface QuestionnaireSubstep {
  _id?: string;
  stepNumber: number;
  stepName?: string;
  title?: string;
  order?: number;
  substepNumber?: number;
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

export interface QuestionnaireDraftPayload {
  substepNumber: number;
  currentSubstep: number;
  completedSubstepNumber: number;
  answers: QuestionnaireAnswer[];
}

export interface RiskAssessmentPayload {
  thirdPartyReference?: string;
}

export type DocumentCategory = 
  | "tax_return"
  | "investment_statements"
  | "insurance_policies"
  | "estate_trust_docs";

export interface DocumentUploadPayload {
  file: File | Blob;
  fileName: string;
  type: DocumentCategory | string;
}

export interface DocumentRequirement {
  code: string;
  title: string;
  required: boolean;
}

export interface BookAppointmentPayload {
  slotId: string;
  meetingLocation?: string;
  isTeamsMeetingRequested?: boolean;
  notes?: string;
}

export type BookingPayload = BookAppointmentPayload;

export interface AppointmentLocation {
  id: string;
  name: string;
}

export interface AppointmentSlotBookedBy {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export interface AppointmentSlot {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration?: number;
  status: "Available" | "Booked" | string;
  bookedBy?: AppointmentSlotBookedBy | null;
  bookedAt?: string | null;
  meetingLocation?: string;
  isTeamsMeetingRequested?: boolean;
  notes?: string;
  bookingStatus?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppointmentSlotsByDateResponse {
  date: string;
  locations: AppointmentLocation[];
  totalSlots: number;
  availableCount: number;
  bookedCount: number;
  slots: AppointmentSlot[];
}
