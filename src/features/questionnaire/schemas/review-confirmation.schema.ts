import { z } from "zod";

export const reviewConfirmationSchema = z.object({
  reviewPersonalInfo: z.string().trim().min(1, "Please select an option"),
  reviewFinancialDetails: z.string().trim().min(1, "Please select an option"),
  reviewGoalsPreferences: z.string().trim().min(1, "Please select an option"),
  isInformationAccurate: z.string().trim().min(1, "Please select an option"),
  makeChangesBeforeSubmit: z.string().trim().min(1, "Please select an option"),
  agreeToProceed: z.string().trim().min(1, "Please select an option"),
  consentToProcessing: z.string().trim().min(1, "Please select an option"),
  agreeToTerms: z.string().trim().min(1, "Please select an option"),
  acceptPrivacyPolicy: z.string().trim().min(1, "Please select an option"),
  acceptPrivacyPolicy2: z.string().trim().min(1, "Please select an option"),
  addAdditionalNotes: z.string().trim().optional(),
  anythingElseToKnow: z.string().trim().optional(),
  readyToSubmit: z.string().trim().min(1, "Please select an option"),
  confirmFinalSubmission: z.string().trim().min(1, "Please select an option"),
  receiveCopy: z.string().trim().min(1, "Please select an option"),
  confirmToSubmit: z.string().trim().min(1, "Please select an option"),
});

export type ReviewConfirmationFormData = z.infer<typeof reviewConfirmationSchema>;
