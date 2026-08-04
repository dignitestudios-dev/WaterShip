"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
// import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { QuestionnaireLayout } from "./questionnaire-layout";

import { questionnaireSchema, QuestionnaireFormData } from "../schemas/questionnaire.schema";

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Check } from "lucide-react";

import { useProgressStore } from "../store/progress.store";

export const QuestionnaireForm = () => {
  const router = useRouter();
  const unlockStep = useProgressStore((state) => state.unlockStep);
  
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  const form = useForm<QuestionnaireFormData>({
    resolver: zodResolver(questionnaireSchema),
    defaultValues: {
      fullName: "",
      gender: "",
      maritalStatus: "",
      hasDependents: "No",
      dependentsCount: "0",
      country: "",
      city: "",
      employmentStatus: "Employed",
      occupation: "",
      industry: "",
      yearsOfExperience: "",
      educationLevel: "",
      primaryIncomeSource: "",
      hasAdditionalIncome: "",
      preferredContact: "",
      contactNumber: "",
      confirmAccurate: false,
    },
    reValidateMode: "onChange",
  });

  const onSubmit = (data: QuestionnaireFormData) => {
    console.log("Form data:", data);
    unlockStep(2);
    router.push("/dashboard/questionnaire/step-2");
  };

  const watchHasDependents = form.watch("hasDependents");
  const watchEmployment = form.watch("employmentStatus");

  return (
    <QuestionnaireLayout currentStep={1}>

      <div className="mt-[50px] text-[#FFFFFF] font-medium text-[14px] leading-[21px] tracking-[-0.01em] uppercase z-10">
        Personal Information
      </div>

      {/* Main Form Grid */}
      <div className="w-[90%] lg:w-[80%] mt-[30px] z-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full  flex flex-col gap-[30px]">

            {/* Grid 3 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-[30px] gap-y-[30px] w-full">

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      1. What is your full name?<span className="text-[#D11D21]">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="John Michael Doe" {...field} className="bg-white/15 border-none rounded-[7px] text-white placeholder:text-white/50 h-[40px]!" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      2. When is your date of birth?<span className="text-[#D11D21]">*</span>
                    </FormLabel>
                    <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                      <PopoverTrigger >
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full h-[40px]! bg-white/15 border-none rounded-[7px] text-left font-normal hover:bg-white/20 hover:text-white",
                              !field.value ? "text-[#E0E0E0]" : "text-white"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "d MMMM yyyy")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50 text-[#E0E0E0]" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setIsDatePickerOpen(false);
                          }}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                        // initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      3. What is your gender?
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/15 border-none rounded-[7px] text-white h-[40px]!">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maritalStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      4. What is your marital status?<span className="text-[#D11D21]">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/15 border-none rounded-[7px] text-white h-[40px]!">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Divorced">Divorced</SelectItem>
                        <SelectItem value="Widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasDependents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      5. Do you have any dependents?<span className="text-[#D11D21]">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/15 border-none rounded-[7px] text-white h-[40px]!">
                          <SelectValue placeholder="Select" />
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
                name="dependentsCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      6. How many dependents you have? <span className="text-sm font-normal">(if Yes above)</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="2" {...field} disabled={watchHasDependents !== "Yes"} className="bg-white/15 border-none rounded-[7px] text-white placeholder:text-white/50 h-[40px]! disabled:opacity-50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      7. Which country do you currently live in?<span className="text-[#D11D21]">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="America" {...field} className="bg-white/15 border-none rounded-[7px] text-white placeholder:text-white/50 h-[40px]!" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      8. Which city do you live in?<span className="text-[#D11D21]">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Houston" {...field} className="bg-white/15 border-none rounded-[7px] text-white placeholder:text-white/50 h-[40px]!" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="employmentStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      9. What is your current employment status?<span className="text-[#D11D21]">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/15 border-none rounded-[7px] text-white h-[40px]!">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Self-employed">Self-employed</SelectItem>
                        <SelectItem value="Unemployed">Unemployed</SelectItem>
                        <SelectItem value="Retired">Retired</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      10. What is your current occupation? <span className="text-sm font-normal">(if employed)</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Software Engineer" {...field} disabled={!["Full-time", "Part-time", "Self-employed"].includes(watchEmployment)} className="bg-white/15 border-none rounded-[7px] text-white placeholder:text-white/50 h-[40px]! disabled:opacity-50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      11. Which industry do you work in?
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Software Engineer" {...field} className="bg-white/15 border-none rounded-[7px] text-white placeholder:text-white/50 h-[40px]!" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="yearsOfExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      12. How many years of work experience do you have?
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="6 Years" {...field} className="bg-white/15 border-none rounded-[7px] text-white placeholder:text-white/50 h-[40px]!" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="educationLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      13. What is your highest level of education?
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/15 border-none rounded-[7px] text-white h-[40px]!">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="High School">High School</SelectItem>
                        <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                        <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                        <SelectItem value="Doctorate">Doctorate</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="primaryIncomeSource"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      14. What is your primary source of income?<span className="text-[#D11D21]">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Salary" {...field} className="bg-white/15 border-none rounded-[7px] text-white placeholder:text-white/50 h-[40px]!" />
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
                      15. Do you have any additional sources of income?
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/15 border-none rounded-[7px] text-white h-[40px]!">
                          <SelectValue placeholder="Select" />
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
                name="preferredContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      16. What is your preferred way for us to contact you?
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/15 border-none rounded-[7px] text-white h-[40px]!">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Email">Email</SelectItem>
                        <SelectItem value="Phone">Phone</SelectItem>
                        <SelectItem value="SMS">SMS</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                      17. What is your contact number?<span className="text-[#D11D21]">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="(202) 555-0143" {...field} className="bg-white/15 border-none rounded-[7px] text-white placeholder:text-white/50 h-[40px]!" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Bottom Actions */}
            <div className=" max-w-full mr-auto mt-[40px] flex flex-col items-start gap-[40px]">

              <FormField
                control={form.control}
                name="confirmAccurate"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="bg-transparent border-white/30 checked:bg-[#2186FF]!  data-[state=checked]:bg-[#2186FF]! data-[state=checked]:text-white rounded-[4px]"
                      />
                    </FormControl>
                    <FormLabel className="text-[#E0E0E0] font-medium text-[14px] leading-[21px]">
                      Do you confirm that the information provided is accurate?
                    </FormLabel>
                  </FormItem>
                )}
              />

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
                        onClick={() => router.push("/dashboard?questionnaireProgress=25")}
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
