"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

import { QuestionnaireLayout } from "./questionnaire-layout";
import { financialDetailsSchema, FinancialDetailsFormData } from "../schemas/financial-details.schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import { useProgressStore } from "../store/progress.store";

export const FinancialDetailsForm = () => {
  const router = useRouter();
  const unlockStep = useProgressStore((state) => state.unlockStep);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  const form = useForm<FinancialDetailsFormData>({
    resolver: zodResolver(financialDetailsSchema),
    defaultValues: {
      monthlyIncome: "",
      annualIncome: "",
      hasAdditionalIncome: "",
      monthlyExpenses: "",
      housingExpenses: "",
      utilitiesExpenses: "",
      transportationExpenses: "",
      lifestyleExpenses: "",
      totalSavings: "",
      hasEmergencyFund: "",
      emergencyFundMonths: "",
      hasInvestments: "",
      investmentTypes: "",
      totalInvestmentsValue: "",
      hasProperty: "",
      propertyValue: "",
      hasOtherAssets: "",
      hasLoans: "",
      totalDebt: "",
      loanTypes: "",
      monthlyLoanRepayment: "",
      financialStability: "",
    },
  });

  const onSubmit = (data: FinancialDetailsFormData) => {
    console.log("Form data:", data);
    unlockStep(3);
    router.push("/dashboard/questionnaire/step-3");
  };

  const watchHasEmergencyFund = form.watch("hasEmergencyFund");
  const watchHasInvestments = form.watch("hasInvestments");

  return (
    <QuestionnaireLayout currentStep={2}>

      <div className="mt-[50px] text-[#FFFFFF] text-center font-medium text-[14px] leading-[21px] tracking-[-0.01em] uppercase z-10">
        Personal Information
      </div>

      {/* Main Form Grid */}
      <div className="w-[90%] lg:w-[80%] max-w-[95vw] mt-[30px] z-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-[30px]">

            {/* Grid 3 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-[30px] gap-y-[30px] w-full">

              <FormField
                control={form.control}
                name="monthlyIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      <span>19. What is your monthly income?<span className="text-[#D11D21]">*</span></span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="$300,000" {...field} className="bg-white/15 border-none rounded-[7px] text-white placeholder:text-white/50 h-[40px]!" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="annualIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      20. What is your annual income?
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="$3,600,000" {...field} className="bg-white/15 border-none rounded-[7px] text-white placeholder:text-white/50 h-[40px]!" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasAdditionalIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      21. Do you have any additional sources of income?
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/15 border-none rounded-[7px] text-white h-[40px]!">
                          <SelectValue placeholder="Yes" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="monthlyExpenses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      <span>22. What are your total monthly expenses?<span className="text-[#D11D21]">*</span></span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="$180,000" {...field} className="bg-white/15 border-none rounded-[7px] text-white placeholder:text-white/50 h-[40px]!" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="housingExpenses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      23. How much do you spend on housing each month?
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="$60,000" {...field} className="bg-white/15 border-none rounded-[7px] text-white placeholder:text-white/50 h-[40px]!" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="utilitiesExpenses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      24. How much do you spend on utilities each month?
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="$20,000" {...field} className="bg-white/15 border-none rounded-[7px] text-white placeholder:text-white/50 h-[40px]!" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="transportationExpenses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      25. How much do you spend on transportation?
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="$15,000" {...field} className="bg-white/15 border-none rounded-[7px] text-white placeholder:text-white/50 h-[40px]!" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lifestyleExpenses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      26. How much do you spend on lifestyle or personal expenses?
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="$40,000" {...field} className="bg-white/15 border-none rounded-[7px] text-white placeholder:text-white/50 h-[40px]!" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalSavings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      <span>27. What is your total savings amount?<span className="text-[#D11D21]">*</span></span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="$1,200,000" {...field} className="bg-white/15 border-none rounded-[7px] text-white placeholder:text-white/50 h-[40px]!" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasEmergencyFund"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      <span>28. Do you currently have an emergency fund?<span className="text-[#D11D21]">*</span></span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/15 border-none rounded-[7px] text-white h-[40px]!">
                          <SelectValue placeholder="Yes" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emergencyFundMonths"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      <span>29. How many months of expenses does your emergency fund cover? <span className="text-sm font-normal">(if Yes above)</span></span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="6 months" {...field} disabled={watchHasEmergencyFund !== "Yes"} className="bg-white/15 border-none rounded-[7px] text-white placeholder:text-white/50 h-[40px]! disabled:opacity-50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasInvestments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      <span>30. Do you currently have any investments?<span className="text-[#D11D21]">*</span></span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/15 border-none rounded-[7px] text-white h-[40px]!">
                          <SelectValue placeholder="Yes" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="investmentTypes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      <span>31. What types of investments you have? <span className="text-sm font-normal">(if Yes above)</span></span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Stocks, Mutual Funds" {...field} disabled={watchHasInvestments !== "Yes"} className="bg-white/15 border-none rounded-[7px] text-white placeholder:text-white/50 h-[40px]! disabled:opacity-50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalInvestmentsValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      32. What is the total value of your investments?
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="$800,000" {...field} className="bg-white/15 border-none rounded-[7px] text-white placeholder:text-white/50 h-[40px]!" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasProperty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      33. Do you own any property?
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/15 border-none rounded-[7px] text-white h-[40px]!">
                          <SelectValue placeholder="Yes" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="propertyValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      34. What is the estimated value of your property?
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="$20,000,000" {...field} className="bg-white/15 border-none rounded-[7px] text-white placeholder:text-white/50 h-[40px]!" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasOtherAssets"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      35. Do you own any other significant assets?
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Car" {...field} className="bg-white/15 border-none rounded-[7px] text-white placeholder:text-white/50 h-[40px]!" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasLoans"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      <span>36. Do you currently have any outstanding loans or debts?<span className="text-[#D11D21]">*</span></span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/15 border-none rounded-[7px] text-white h-[40px]!">
                          <SelectValue placeholder="Yes" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalDebt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      37. What is your total outstanding debt?
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="$5,000,000" {...field} className="bg-white/15 border-none rounded-[7px] text-white placeholder:text-white/50 h-[40px]!" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="loanTypes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      38. What types of loans do you have?
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Home Loan" {...field} className="bg-white/15 border-none rounded-[7px] text-white placeholder:text-white/50 h-[40px]!" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="monthlyLoanRepayment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      39. What is your monthly loan repayment amount?
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="$70,000" {...field} className="bg-white/15 border-none rounded-[7px] text-white placeholder:text-white/50 h-[40px]!" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="financialStability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      40. How would you describe your current financial stability?
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/15 border-none rounded-[7px] text-white h-[40px]!">
                          <SelectValue placeholder="Moderate" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Moderate">Moderate</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit & Dialog */}
            <div className="w-full flex items-center justify-start mt-6">
              <div className="flex flex-row gap-[15px] items-center">
                <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
                  <DialogTrigger >
                    <Button
                      type="button"
                      variant="outline"
                      className="w-[167px] h-[42px] rounded-[96px] bg-white/15 border-none text-white hover:bg-white/20 font-bold text-[14px]"
                    >
                      Save & Exit
                    </Button>
                  </DialogTrigger>
                  <DialogContent showCloseButton={false} className="w-[343px] h-[340px] bg-gradient-to-b from-[#034593] to-[#01152D] rounded-[32px] border-none shadow-[0px_4px_30px_rgba(33,134,255,0.15)] p-0 flex flex-col items-center">

                    {/* Circle Check Icon */}
                    <div className="w-[67px] h-[67px] mt-[39px] bg-white/15 rounded-full flex items-center justify-center">
                      <div className="w-[40px] h-[35px] bg-transparent text-white flex items-center justify-center">
                        <Check size={40} strokeWidth={3} />
                      </div>
                    </div>

                    {/* Text Wrapper */}
                    <div className="flex flex-col items-center mt-[8px] w-[314px] px-2">
                      <h2 className="font-['Poppins'] font-semibold text-[22px] leading-[33px] text-white text-center">
                        Save & Exit
                      </h2>
                      <p className="font-['Poppins'] font-normal text-[13px] leading-[160%] text-[#E0E0E0] text-center mt-[5px] max-w-[243px]">
                        Your progress will be saved. You can continue from where you left off anytime.
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="absolute bottom-[39px] flex flex-row items-center gap-[5px] w-[289px] justify-center">
                      <DialogClose >
                        <button className="w-[142px] h-[51px] bg-white/15 rounded-[73px] flex items-center justify-center font-['Poppins'] font-medium text-[14px] text-white hover:bg-white/20 transition">
                          Cancel
                        </button>
                      </DialogClose>
                      <button
                        onClick={() => router.push("/dashboard?questionnaireProgress=50")}
                        className="w-[142px] h-[51px] bg-gradient-to-br from-[#2186FF] to-[rgba(33,134,255,0.15)] rounded-[73px] flex items-center justify-center font-['Poppins'] font-medium text-[14px] text-white hover:opacity-90 transition"
                      >
                        Save & Exit
                      </button>
                    </div>

                  </DialogContent>
                </Dialog>

                <Button
                  type="submit"
                  className="w-[167px] h-[42px] rounded-[96px] bg-gradient-to-br from-[#2186FF] to-[rgba(33,134,255,0.15)] text-[#DDEBF8] hover:opacity-90 font-bold text-[14px] border-none"
                >
                  Continue
                </Button>
              </div>
            </div>

          </form>
        </Form>
      </div>

    </QuestionnaireLayout>
  );
};
