"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check } from "lucide-react";

import { QuestionnaireLayout } from "./questionnaire-layout";
import { goalsPreferencesSchema, GoalsPreferencesFormData } from "../schemas/goals-preferences.schema";

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

export const GoalsPreferencesForm = () => {
  const router = useRouter();
  const unlockStep = useProgressStore((state) => state.unlockStep);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  const form = useForm<GoalsPreferencesFormData>({
    resolver: zodResolver(goalsPreferencesSchema),
    defaultValues: {
      primaryFinancialGoals: "",
      shortTermFinancialGoals: "",
      longTermFinancialGoals: "",
      planningForRetirement: "",
      retirementAge: "",
      targetRetirementSavings: "",
      investmentTimeHorizon: "",
      financialRiskLevel: "",
      reactionToLostValue: "",
      investmentApproach: "",
      returnsVsGrowth: "",
      liquidityImportance: "",
      interestedInEthicalInvestments: "",
      investmentExperience: "",
      investmentInvolvement: "",
      advisorExpectations: "",
    },
  });
  const onSubmit = (data: GoalsPreferencesFormData) => {
    console.log("Form data:", data);
    unlockStep(4);
    router.push("/dashboard/questionnaire/step-4");
  };

  return (
    <QuestionnaireLayout currentStep={3}>

      <div className="mt-[50px] text-[#FFFFFF] font-medium text-[14px] leading-[21px] tracking-[-0.01em] uppercase z-10">
        Goals & Preferences
      </div>

      {/* Main Form Grid */}
      <div className="w-[90%] lg:w-[80%] mt-[30px] z-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-[30px]">

            {/* Grid 3 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-[30px] gap-y-[30px] w-full">

              <FormField
                control={form.control}
                name="primaryFinancialGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      <span>41. What are your primary financial goals?<span className="text-[#D11D21]">*</span></span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Wealth growth" {...field} className="bg-white/15 border-none rounded-[7px] text-white placeholder:text-white/50 h-[40px]!" />
                    </FormControl>
                    <FormMessage   />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shortTermFinancialGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      42. What are your short-term financial goals?
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Buy a car" {...field} className="bg-white/15 border-none rounded-[7px] text-white placeholder:text-white/50 h-[40px]!" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longTermFinancialGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      <span>43. What are your long-term financial goals?<span className="text-[#D11D21]">*</span></span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Retirement planning" {...field} className="bg-white/15 border-none rounded-[7px] text-white placeholder:text-white/50 h-[40px]!" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="planningForRetirement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      <span>44. Are you currently planning for retirement?<span className="text-[#D11D21]">*</span></span>
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
                name="retirementAge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      45. At what age would you like to retire?
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="60" {...field} className="bg-white/15 border-none rounded-[7px] text-white placeholder:text-white/50 h-[40px]!" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetRetirementSavings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      46. Do you have a target retirement savings amount?
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="$50,000,000" {...field} className="bg-white/15 border-none rounded-[7px] text-white placeholder:text-white/50 h-[40px]!" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="investmentTimeHorizon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      <span>47. What is your investment time horizon?<span className="text-[#D11D21]">*</span></span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="10+ years" {...field} className="bg-white/15 border-none rounded-[7px] text-white placeholder:text-white/50 h-[40px]!" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="financialRiskLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      <span>48. What level of financial risk are you comfortable with?<span className="text-[#D11D21]">*</span></span>
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

              <FormField
                control={form.control}
                name="reactionToLostValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      49. How would you react if your investments lost value?
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Hold investments" {...field} className="bg-white/15 border-none rounded-[7px] text-white placeholder:text-white/50 h-[40px]!" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="investmentApproach"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      50. What type of investment approach do you prefer?
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Balanced" {...field} className="bg-white/15 border-none rounded-[7px] text-white placeholder:text-white/50 h-[40px]!" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="returnsVsGrowth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      51. Do you prefer stable returns or higher growth opportunities?
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Growth" {...field} className="bg-white/15 border-none rounded-[7px] text-white placeholder:text-white/50 h-[40px]!" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="liquidityImportance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      52. How important is liquidity for you?
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/15 border-none rounded-[7px] text-white h-[40px]!">
                          <SelectValue placeholder="Medium" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interestedInEthicalInvestments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      53. Are you interested in ethical or sustainable investments?
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
                name="investmentExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      54. How experienced are you with investments?
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/15 border-none rounded-[7px] text-white h-[40px]!">
                          <SelectValue placeholder="Intermediate" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="investmentInvolvement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      55. How involved would you like to be in managing your investments?
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/15 border-none rounded-[7px] text-white h-[40px]!">
                          <SelectValue placeholder="Medium" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="advisorExpectations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      56. What do you expect from a financial advisor?
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Long-term planning" {...field} className="bg-white/15 border-none rounded-[7px] text-white placeholder:text-white/50 h-[40px]!" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>

            {/* Submit & Dialog */}
            <div className="w-full flex items-center justify-start mt-6">
              <div className="flex flex-row gap-[15px] items-center">
                <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
                  <DialogTrigger  >
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
                        onClick={() => router.push("/dashboard?questionnaireProgress=75")}
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
