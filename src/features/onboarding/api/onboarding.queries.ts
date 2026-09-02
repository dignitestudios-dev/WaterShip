"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  getOnboardingProgress, 
  getQuestions, 
  getDocumentRequirements, 
  getBookingAvailability,
  saveQuestionnaireDraft,
  completeQuestionnaireStep,
  completeRiskAssessment,
  uploadDocument,
  completeDocumentUpload,
  bookAppointment
} from "./onboarding.api";
import { getApiErrorMessage } from "@/lib/api-response";

export const useOnboardingProgress = () => {
  return useQuery({
    queryKey: ["onboarding", "progress"],
    queryFn: getOnboardingProgress,
  });
};

export const useQuestions = () => {
  return useQuery({
    queryKey: ["onboarding", "questions"],
    queryFn: getQuestions,
  });
};

export const useDocumentRequirements = () => {
  return useQuery({
    queryKey: ["onboarding", "document-requirements"],
    queryFn: getDocumentRequirements,
  });
};

export const useBookingAvailability = (date?: string) => {
  return useQuery({
    queryKey: ["onboarding", "booking-availability", date],
    queryFn: () => getBookingAvailability(date),
  });
};

export const useSaveQuestionnaireDraft = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: saveQuestionnaireDraft,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["onboarding", "progress"] });
      toast.success(data.message || "Draft saved");
    },
    onError: (error: any) => {
      const message = getApiErrorMessage(error, "Failed to save draft");
      toast.error(message);
    }
  });
};

export const useCompleteQuestionnaireStep = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: completeQuestionnaireStep,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["onboarding", "progress"] });
      toast.success(data.message || "Step completed");
    },
    onError: (error: any) => {
      const message = getApiErrorMessage(error, "Failed to complete step");
      toast.error(message);
    }
  });
};

export const useCompleteRiskAssessment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: completeRiskAssessment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["onboarding", "progress"] });
      toast.success(data.message || "Risk assessment completed");
      if (data.data?.redirectUrl) {
        window.location.href = data.data.redirectUrl;
      }
    },
    onError: (error: any) => {
      const message = getApiErrorMessage(error, "Failed to complete risk assessment");
      toast.error(message);
    }
  });
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: uploadDocument,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["onboarding", "progress"] });
      toast.success(data.message || "Document uploaded");
    },
    onError: (error: any) => {
      const message = getApiErrorMessage(error, "Failed to upload document");
      toast.error(message);
    }
  });
};

export const useCompleteDocumentUpload = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: completeDocumentUpload,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["onboarding", "progress"] });
      toast.success(data.message || "Document step completed");
    },
    onError: (error: any) => {
      const message = getApiErrorMessage(error, "Failed to complete document step");
      toast.error(message);
    }
  });
};

export const useBookAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: bookAppointment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["onboarding", "progress"] });
      toast.success(data.message || "Appointment booked successfully");
    },
    onError: (error: any) => {
      const message = getApiErrorMessage(error, "Failed to book appointment");
      toast.error(message);
    }
  });
};
