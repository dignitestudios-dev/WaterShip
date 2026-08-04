import { z } from "zod";

export const financialDetailsSchema = z
  .object({
    monthlyIncome: z.string().trim().min(1, "Monthly income is required"),
    annualIncome: z.string().trim().min(1, "Annual income is required"),
    hasAdditionalIncome: z.string().trim().min(1, "Please select an option"),
    monthlyExpenses: z.string().trim().min(1, "Monthly expenses are required"),
    housingExpenses: z.string().trim().min(1, "Housing expenses are required"),
    utilitiesExpenses: z.string().trim().min(1, "Utilities expenses are required"),
    transportationExpenses: z.string().trim().min(1, "Transportation expenses are required"),
    lifestyleExpenses: z.string().trim().min(1, "Lifestyle expenses are required"),
    totalSavings: z.string().trim().min(1, "Total savings amount is required"),
    hasEmergencyFund: z.string().trim().min(1, "Please select an option"),
    emergencyFundMonths: z.string().trim().optional(),
    hasInvestments: z.string().trim().min(1, "Please select an option"),
    investmentTypes: z.string().trim().optional(),
    totalInvestmentsValue: z.string().trim().min(1, "Total investments value is required"),
    hasProperty: z.string().trim().min(1, "Please select an option"),
    propertyValue: z.string().trim().optional(),
    hasOtherAssets: z.string().trim().min(1, "Other assets is required"),
    hasLoans: z.string().trim().min(1, "Please select an option"),
    totalDebt: z.string().trim().optional(),
    loanTypes: z.string().trim().optional(),
    monthlyLoanRepayment: z.string().trim().optional(),
    financialStability: z.string().trim().min(1, "Please select an option"),
  })
  .superRefine((data, ctx) => {
    if (data.hasEmergencyFund === "Yes" && !data.emergencyFundMonths) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["emergencyFundMonths"],
        message: "Please specify number of months",
      });
    }

    if (data.hasInvestments === "Yes" && !data.investmentTypes) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["investmentTypes"],
        message: "Please specify investment types",
      });
    }
  });

export type FinancialDetailsFormData = z.infer<typeof financialDetailsSchema>;
