import { z } from "zod";

export const questionnaireSchema = z
  .object({
    fullName: z.string().trim().min(2, "Full name is required"),
    dateOfBirth: z.date({
      message: "Date of birth is required",
    }),
    gender: z.string().trim().min(1, "Gender is required"),
    maritalStatus: z.string().trim().min(1, "Marital status is required"),
    hasDependents: z.string().trim().min(1, "Please select an option"),
    dependentsCount: z.string().trim().optional(),
    country: z.string().trim().min(1, "Country is required"),
    city: z.string().trim().min(1, "City is required"),
    employmentStatus: z.string().trim().min(1, "Employment status is required"),
    occupation: z.string().trim().optional(),
    industry: z.string().trim().min(1, "Industry is required"),
    yearsOfExperience: z.string().trim().min(1, "Years of experience is required"),
    educationLevel: z.string().trim().min(1, "Education level is required"),
    primaryIncomeSource: z.string().trim().min(1, "Primary income source is required"),
    hasAdditionalIncome: z.string().trim().min(1, "Please select an option"),
    preferredContact: z.string().trim().min(1, "Preferred contact is required"),
    contactNumber: z.string().trim().min(1, "Contact number is required"),
    confirmAccurate: z.boolean().refine((val) => val === true, {
      message: "You must confirm that the information is accurate.",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.hasDependents === "Yes" && !data.dependentsCount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dependentsCount"],
        message: "Please specify number of dependents",
      });
    }

    if (["Full-time", "Part-time", "Self-employed"].includes(data.employmentStatus) && !data.occupation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["occupation"],
        message: "Occupation is required if employed",
      });
    }
  });

export type QuestionnaireFormData = z.infer<typeof questionnaireSchema>;
