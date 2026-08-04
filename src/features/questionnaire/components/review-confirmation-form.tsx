"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

import { QuestionnaireLayout } from "./questionnaire-layout";
import { reviewConfirmationSchema, ReviewConfirmationFormData } from "../schemas/review-confirmation.schema";

import { Button } from "@/components/ui/button";
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
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { useProgressStore } from "../store/progress.store";

export const ReviewConfirmationForm = () => {
  const router = useRouter();
  const setCompleted = useProgressStore((state) => state.setCompleted);
  
  const [submitState, setSubmitState] = useState<'idle' | 'confirm' | 'submitting' | 'success'>('idle');
  
  const form = useForm<ReviewConfirmationFormData>({
    resolver: zodResolver(reviewConfirmationSchema),
    defaultValues: {
      reviewPersonalInfo: "",
      reviewFinancialDetails: "",
      reviewGoalsPreferences: "",
      isInformationAccurate: "",
      makeChangesBeforeSubmit: "",
      agreeToProceed: "",
      consentToProcessing: "",
      agreeToTerms: "",
      acceptPrivacyPolicy: "",
      acceptPrivacyPolicy2: "",
      addAdditionalNotes: "",
      anythingElseToKnow: "",
      readyToSubmit: "",
      confirmFinalSubmission: "",
      receiveCopy: "",
      confirmToSubmit: "",
    },
  });

  const onSubmit = (data: ReviewConfirmationFormData) => {
    console.log("Form data:", data);
    setSubmitState('confirm');
  };

  const handleSave = () => {
    setSubmitState('submitting');
    setTimeout(() => {
      setSubmitState('success');
      setTimeout(() => {
        setCompleted(true);
        router.push("/dashboard/questionnaire/completed");
      }, 1500);
    }, 2000);
  };

  return (
    <QuestionnaireLayout currentStep={4}>
      
      <div className="mt-[50px] text-[#FFFFFF] font-medium text-[14px] leading-[21px] tracking-[-0.01em] uppercase z-10">
        Review & Confirmation
      </div>

      {/* Main Form Grid */}
      <div className="w-[90%] lg:w-[80%] mt-[30px] z-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-[30px]">
            
            {/* Grid 3 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-[30px] gap-y-[30px] w-full">
              
              <FormField
                control={form.control}
                name="reviewPersonalInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[14px] leading-[21px] min-h-[42px] flex items-end pb-[5px]">
                      57. Would you like to review your personal information?
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
                name="reviewFinancialDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[14px] leading-[21px] min-h-[42px] flex items-end pb-[5px]">
                      58. Would you like to review your financial details?
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
                name="reviewGoalsPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[14px] leading-[21px] min-h-[42px] flex items-end pb-[5px]">
                      59. Would you like to review your goals and preferences?
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
                name="isInformationAccurate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[14px] leading-[21px] min-h-[42px] flex items-end pb-[5px]">
                      <span>60. Is all the information you provided by you is accurate?<span className="text-[#D11D21]">*</span></span>
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
                name="makeChangesBeforeSubmit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[14px] leading-[21px] min-h-[42px] flex items-end pb-[5px]">
                      <span>61. Would you like to make any changes before submitting?<span className="text-[#D11D21]">*</span></span>
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
                name="agreeToProceed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[14px] leading-[21px] min-h-[42px] flex items-end pb-[5px]">
                      <span>62. Do you agree to proceed with the provided information?<span className="text-[#D11D21]">*</span></span>
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
                name="consentToProcessing"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[14px] leading-[21px] min-h-[42px] flex items-end pb-[5px]">
                      <span>63. Do you consent to the processing of your data?<span className="text-[#D11D21]">*</span></span>
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
                name="agreeToTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[14px] leading-[21px] min-h-[42px] flex items-end pb-[5px]">
                      <span>64. Do you agree to the terms and conditions?<span className="text-[#D11D21]">*</span></span>
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
                name="acceptPrivacyPolicy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[14px] leading-[21px] min-h-[42px] flex items-end pb-[5px]">
                      <span>65. Do you accept the privacy policy?<span className="text-[#D11D21]">*</span></span>
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
                name="acceptPrivacyPolicy2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[14px] leading-[21px] min-h-[42px] flex items-end pb-[5px]">
                      <span>65. Do you accept the privacy policy?<span className="text-[#D11D21]">*</span></span>
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
                name="addAdditionalNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[14px] leading-[21px] min-h-[42px] flex items-end pb-[5px]">
                      66. Would you like to add any additional notes?
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
                name="anythingElseToKnow"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[14px] leading-[21px] min-h-[42px] flex items-end pb-[5px]">
                      67. Is there anything else you would like us to know?
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
                name="readyToSubmit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[14px] leading-[21px] min-h-[42px] flex items-end pb-[5px]">
                      <span>68. Are you ready to submit questionnaire?<span className="text-[#D11D21]">*</span></span>
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
                name="confirmFinalSubmission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[14px] leading-[21px] min-h-[42px] flex items-end pb-[5px]">
                      <span>69. Do you confirm your final submission?<span className="text-[#D11D21]">*</span></span>
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
                name="receiveCopy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-[14px] leading-[21px] min-h-[42px] flex items-end pb-[5px]">
                      70. Would you like to receive a copy of your responses?
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

              <div className="flex flex-col">
                <FormField
                  control={form.control}
                  name="confirmToSubmit"
                  render={({ field }) => (
                    <FormItem className="mb-[30px]">
                      <FormLabel className="text-white font-medium text-[14px] leading-[21px] min-h-[42px] flex items-end pb-[5px]">
                        <span>71. Please confirm to submit your questionnaire.<span className="text-[#D11D21]">*</span></span>
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

                <Button
                  type="submit"
                  className="w-[235px] h-[42px] rounded-[96px] bg-gradient-to-br from-[#2186FF] to-[rgba(33,134,255,0.15)] text-white hover:opacity-90 font-bold text-[14px] border-none"
                >
                  Submit Questionnaire
                </Button>
              </div>
            </div>
            
          </form>
        </Form>
      </div>

      <Dialog 
        open={submitState !== 'idle'} 
        onOpenChange={(open) => {
          // Only allow closing if we are in confirm state.
          // Once submitting or success, user cannot close the dialog.
          if (!open && submitState === 'confirm') {
            setSubmitState('idle');
          }
        }}
      >
        <DialogContent 
          className="border-none w-[343px] h-[338px] p-0 rounded-[32px] overflow-hidden bg-transparent shadow-none" 
          showCloseButton={false}
        >
          <div className="w-full h-full bg-gradient-to-b from-[#034593] to-[#01152D] shadow-[0px_4px_30px_rgba(33,134,255,0.15)] flex flex-col items-center justify-center relative p-4">
            
            {submitState === 'confirm' && (
              <>
                <div className="w-[67px] h-[67px] bg-white/15 rounded-full flex items-center justify-center mb-[15px]">
                  <Check className="w-[40px] h-[35px] text-white" strokeWidth={3} />
                </div>
                <h2 className="font-semibold text-[22px] leading-[33px] text-center text-white mb-[15px]">
                  Submit Questionnaire?
                </h2>
                <p className="font-normal text-[13px] leading-[160%] text-center text-[#E0E0E0] mb-[30px] max-w-[280px]">
                  Are you sure you want to submit your questionnaire? You won't be able to make changes after submission.
                </p>
                <div className="flex gap-[5px]">
                  <button 
                    onClick={() => setSubmitState('idle')}
                    className="flex justify-center items-center w-[142px] h-[51px] bg-white/15 rounded-[73px] text-white font-medium text-[14px] hover:bg-white/20 transition"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    className="flex justify-center items-center w-[142px] h-[51px] bg-gradient-to-br from-[#2186FF] to-[rgba(33,134,255,0.15)] rounded-[73px] text-white font-medium text-[14px] hover:opacity-90 transition"
                  >
                    Save
                  </button>
                </div>
              </>
            )}

            {submitState === 'submitting' && (
              <>
                <div className="w-[67px] h-[67px] flex items-center justify-center mb-[15px]">
                  <Loader2 className="w-[60px] h-[60px] text-white animate-spin" strokeWidth={2} />
                </div>
                <h2 className="font-semibold text-[22px] leading-[33px] text-center text-white mb-[15px]">
                  Submitting Your<br/>Questionnaire
                </h2>
                <p className="font-normal text-[13px] leading-[160%] text-center text-[#E0E0E0] max-w-[250px]">
                  Please wait while we submit your responses.
                </p>
              </>
            )}

            {submitState === 'success' && (
              <>
                <div className="w-[67px] h-[67px] bg-white/15 rounded-full flex items-center justify-center mb-[15px]">
                  <Check className="w-[40px] h-[35px] text-white" strokeWidth={3} />
                </div>
                <h2 className="font-semibold text-[22px] leading-[33px] text-center text-white mb-[15px]">
                  Submission Successful
                </h2>
                <p className="font-normal text-[13px] leading-[160%] text-center text-[#E0E0E0] max-w-[250px]">
                  Thank you! Your responses have been recorded. Let's move to the next step.
                </p>
              </>
            )}

          </div>
        </DialogContent>
      </Dialog>
    </QuestionnaireLayout>
  );
};
