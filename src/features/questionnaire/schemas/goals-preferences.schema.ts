import { z } from "zod";

export const goalsPreferencesSchema = z.object({
  primaryFinancialGoals: z.string().trim().min(1, "Primary financial goals are required"),
  shortTermFinancialGoals: z.string().trim().min(1, "Short-term financial goals are required"),
  longTermFinancialGoals: z.string().trim().min(1, "Long-term financial goals are required"),
  planningForRetirement: z.string().trim().min(1, "Please select an option"),
  retirementAge: z.string().trim().min(1, "Retirement age is required"),
  targetRetirementSavings: z.string().trim().min(1, "Target retirement savings is required"),
  investmentTimeHorizon: z.string().trim().min(1, "Investment time horizon is required"),
  financialRiskLevel: z.string().trim().min(1, "Please select an option"),
  reactionToLostValue: z.string().trim().min(1, "Reaction to lost value is required"),
  investmentApproach: z.string().trim().min(1, "Investment approach is required"),
  returnsVsGrowth: z.string().trim().min(1, "Returns vs growth preference is required"),
  liquidityImportance: z.string().trim().min(1, "Please select an option"),
  interestedInEthicalInvestments: z.string().trim().min(1, "Please select an option"),
  investmentExperience: z.string().trim().min(1, "Please select an option"),
  investmentInvolvement: z.string().trim().min(1, "Please select an option"),
  advisorExpectations: z.string().trim().min(1, "Advisor expectations are required"),
});

export type GoalsPreferencesFormData = z.infer<typeof goalsPreferencesSchema>;
