import { api } from "@/lib/axios";
import { ApiResponse } from "@/features/auth";
import { 
  OnboardingStatus, 
  QuestionnairePayload, 
  RiskAssessmentPayload, 
  DocumentUploadPayload,
  DocumentRequirement,
  BookingPayload
} from "../types/onboarding.types";

export const getOnboardingProgress = async (): Promise<ApiResponse<OnboardingStatus>> => {
  const { data } = await api.get<ApiResponse<OnboardingStatus>>("/onboarding");
  return data;
};

export const getQuestions = async (): Promise<ApiResponse<any>> => {
  const { data } = await api.get<ApiResponse<any>>("/onboarding/questions");
  return data;
};

export const getDocumentRequirements = async (): Promise<ApiResponse<DocumentRequirement[]>> => {
  const { data } = await api.get<ApiResponse<DocumentRequirement[]>>("/onboarding/document-requirements");
  return data;
};

export const getBookingAvailability = async (date?: string): Promise<ApiResponse<any>> => {
  const query = date ? `?date=${date}` : "";
  const { data } = await api.get<ApiResponse<any>>(`/onboarding/booking-availability${query}`);
  return data;
};

export const saveQuestionnaireDraft = async (payload: QuestionnairePayload): Promise<ApiResponse> => {
  const { data } = await api.post<ApiResponse>("/onboarding/questionnaire/draft", payload);
  return data;
};

export const completeQuestionnaireStep = async (payload: QuestionnairePayload): Promise<ApiResponse> => {
  const { data } = await api.post<ApiResponse>("/onboarding/questionnaire/complete", payload);
  return data;
};

export const completeRiskAssessment = async (payload: RiskAssessmentPayload): Promise<ApiResponse<{ redirectUrl?: string }>> => {
  const { data } = await api.post<ApiResponse<{ redirectUrl?: string }>>("/onboarding/risk-assessment/complete", payload);
  return data;
};

export const uploadDocument = async (payload: DocumentUploadPayload): Promise<ApiResponse<any>> => {
  const formData = new FormData();
  formData.append("file", payload.file);
  formData.append("fileName", payload.fileName);
  formData.append("type", payload.type);

  const { data } = await api.post<ApiResponse<any>>("/onboarding/upload-document", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const completeDocumentUpload = async (): Promise<ApiResponse> => {
  const { data } = await api.post<ApiResponse>("/onboarding/document-upload/complete");
  return data;
};

export const bookAppointment = async (payload: BookingPayload): Promise<ApiResponse> => {
  const { data } = await api.post<ApiResponse>("/onboarding/book-appointment", payload);
  return data;
};
