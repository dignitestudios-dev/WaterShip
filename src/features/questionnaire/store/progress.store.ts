import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProgressState {
  maxUnlockedStep: number;
  isCompleted: boolean;
  isRiskAssessmentCompleted: boolean;
  uploadedDocuments: Record<string, string>;
  isAppointmentBooked: boolean;
  unlockStep: (step: number) => void;
  setCompleted: (completed: boolean) => void;
  setRiskAssessmentCompleted: (completed: boolean) => void;
  setDocumentUploaded: (id: string, filename: string) => void;
  removeDocument: (id: string) => void;
  setAppointmentBooked: (booked: boolean) => void;
  reset: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      maxUnlockedStep: 1,
      isCompleted: false,
      isRiskAssessmentCompleted: false,
      uploadedDocuments: {},
      isAppointmentBooked: false,
      unlockStep: (step: number) =>
        set((state) => ({
          maxUnlockedStep: Math.max(state.maxUnlockedStep, step),
        })),
      setCompleted: (completed: boolean) => set({ isCompleted: completed }),
      setRiskAssessmentCompleted: (completed: boolean) => set({ isRiskAssessmentCompleted: completed }),
      setDocumentUploaded: (id: string, filename: string) => 
        set((state) => ({
          uploadedDocuments: { ...state.uploadedDocuments, [id]: filename }
        })),
      removeDocument: (id: string) => 
        set((state) => {
          const newDocs = { ...state.uploadedDocuments };
          delete newDocs[id];
          return { uploadedDocuments: newDocs };
        }),
      setAppointmentBooked: (booked: boolean) => set({ isAppointmentBooked: booked }),
      reset: () => set({ 
        maxUnlockedStep: 1, 
        isCompleted: false, 
        isRiskAssessmentCompleted: false, 
        uploadedDocuments: {},
        isAppointmentBooked: false 
      }),
    }),
    {
      name: "questionnaire-progress-storage",
    }
  )
);
