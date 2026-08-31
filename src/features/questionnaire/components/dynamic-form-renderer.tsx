"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { QuestionnaireQuestion } from "@/features/onboarding/types/onboarding.types";
import { format } from "date-fns";
import { CalendarIcon, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

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
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

interface DynamicFormRendererProps {
  questions: QuestionnaireQuestion[];
  onComplete: (data: any) => void;
  onSaveDraft: (data: any) => void;
}

export const DynamicFormRenderer = ({ questions, onComplete, onSaveDraft }: DynamicFormRendererProps) => {
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  // Dynamically build Zod schema
  const generateSchema = (qs: QuestionnaireQuestion[]) => {
    const schemaObj: Record<string, z.ZodTypeAny> = {};
    
    const addQuestionToSchema = (q: QuestionnaireQuestion) => {
      let fieldSchema: z.ZodTypeAny = z.any();

      if (q.questionType === "text" || q.questionType === "radio" || q.questionType === "select" || q.questionType === "dropdown") {
        let strSchema = z.string().trim();
        fieldSchema = q.required ? strSchema.min(1, "This field is required") : strSchema.optional();
      } else if (q.questionType === "number") {
        let numSchema = z.string().trim();
        fieldSchema = q.required ? numSchema.min(1, "This field is required") : numSchema.optional();
      } else if (q.questionType === "date") {
        let dateSchema = z.date();
        fieldSchema = q.required ? dateSchema : dateSchema.optional();
      } else if (q.questionType === "checkbox") {
        let boolSchema = z.boolean();
        fieldSchema = q.required ? boolSchema.refine((val: boolean) => val === true, "Must be checked") : boolSchema.optional();
      }
      
      schemaObj[q.questionId] = fieldSchema;

      if (q.conditionalLogic) {
        q.conditionalLogic.forEach(cond => {
          cond.questions.forEach(addQuestionToSchema);
        });
      }
    };

    qs.forEach(addQuestionToSchema);
    return z.object(schemaObj);
  };

  const dynamicSchema = generateSchema(questions);

  const form = useForm<Record<string, any>>({
    resolver: zodResolver(dynamicSchema),
    defaultValues: {}, 
    reValidateMode: "onChange",
  });

  const onSubmit = (data: any) => {
    onComplete(data);
  };

  const handleSaveDraft = () => {
    onSaveDraft(form.getValues());
  };

  const renderField = (q: QuestionnaireQuestion) => {
    const value = form.watch(q.questionId);
    
    // Check conditional logic rendering
    let activeConditionalQuestions: QuestionnaireQuestion[] = [];
    if (q.conditionalLogic) {
      const activeCondition = q.conditionalLogic.find(cond => String(cond.dependsOnValue) === String(value));
      if (activeCondition) {
        activeConditionalQuestions = activeCondition.questions;
      }
    }

    return (
      <div key={q.questionId} className="flex flex-col gap-[30px]">
        <FormField
          control={form.control}
          name={q.questionId}
          render={({ field }) => (
            <FormItem className={q.questionType === "checkbox" ? "flex flex-row items-center justify-start space-x-3 space-y-0" : "flex flex-col"}>
              {q.questionType !== "checkbox" && (
                <FormLabel className="text-white font-medium text-[16px] leading-[24px] min-h-[56px] flex items-end pb-[5px]">
                  {q.text}{q.required && <span className="text-[#D11D21]">*</span>}
                </FormLabel>
              )}
              
              {/* Text / Number Input */}
              {(q.questionType === "text" || q.questionType === "number") && (
                <FormControl>
                  <Input 
                    type={q.questionType === "number" ? "number" : "text"}
                    placeholder="Enter answer" 
                    {...field} 
                    value={typeof field.value === "string" || typeof field.value === "number" ? field.value : ""}
                    className="bg-white/15 border-none rounded-[7px] text-white placeholder:text-white/50 h-[40px]!" 
                  />
                </FormControl>
              )}

              {/* Select / Dropdown / Radio (Map all to select for now) */}
              {(q.questionType === "select" || q.questionType === "dropdown" || q.questionType === "radio") && (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white/15 border-none rounded-[7px] text-white h-[40px]!">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {q.options?.map((opt, i) => (
                      <SelectItem key={i} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Date */}
              {q.questionType === "date" && (
                <Popover>
                  <PopoverTrigger>
                    <Button
                      type="button"
                      variant={"outline"}
                      className={cn(
                        "w-full h-[40px]! bg-white/15 border-none rounded-[7px] text-left font-normal hover:bg-white/20 hover:text-white",
                        !field.value ? "text-[#E0E0E0]" : "text-white"
                      )}
                    >
                      {field.value instanceof Date || typeof field.value === "string" ? format(new Date(field.value), "d MMMM yyyy") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50 text-[#E0E0E0]" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value instanceof Date ? field.value : undefined}
                      onSelect={(date) => field.onChange(date)}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    />
                  </PopoverContent>
                </Popover>
              )}

              {/* Checkbox */}
              {q.questionType === "checkbox" && (
                <>
                  <FormControl>
                    <Checkbox
                      checked={Boolean(field.value)}
                      onCheckedChange={field.onChange}
                      className="bg-transparent border-white/30 data-checked:!bg-[#2186FF] data-checked:!border-[#2186FF] data-checked:text-white rounded-[4px]"
                    />
                  </FormControl>
                  <FormLabel className="text-[#E0E0E0] font-medium text-[14px] leading-[21px]">
                    {q.text}
                  </FormLabel>
                </>
              )}

              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Render active conditional questions */}
        {activeConditionalQuestions.length > 0 && (
          <div className="pl-4 border-l-2 border-white/20 ml-2 mt-2 flex flex-col gap-[30px]">
            {activeConditionalQuestions.map(renderField)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-[90%] lg:w-[80%] mt-[30px] z-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-[30px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-[30px] gap-y-[30px] w-full">
            {questions.map(renderField)}
          </div>

          {/* Bottom Actions */}
          <div className="max-w-full mr-auto flex flex-col items-start gap-[40px]">
            <div className="flex flex-row gap-[15px] items-center">
              <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
                <DialogTrigger>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-[167px] h-[42px] rounded-[96px] bg-white/15 border-none text-white hover:bg-white/20 font-bold text-[14px]"
                  >
                    Save & Exit
                  </Button>
                </DialogTrigger>
                <DialogContent showCloseButton={false} className="w-[343px] h-[340px] bg-gradient-to-b from-[#034593] to-[#01152D] rounded-[32px] border-none p-0 flex flex-col items-center">
                  <div className="w-[67px] h-[67px] mt-[39px] bg-white/15 rounded-full flex items-center justify-center">
                    <Check size={40} strokeWidth={3} className="text-white" />
                  </div>
                  <div className="flex flex-col items-center mt-[8px] w-[314px] px-2">
                    <h2 className="font-semibold text-[22px] leading-[33px] text-white text-center">Save & Exit</h2>
                    <p className="text-[13px] leading-[160%] text-[#E0E0E0] text-center mt-[5px] max-w-[243px]">
                      Your progress will be saved. You can continue from where you left off anytime.
                    </p>
                  </div>
                  <div className="absolute bottom-[39px] flex flex-row items-center gap-[5px] w-[289px] justify-center">
                    <DialogClose>
                      <button className="w-[142px] h-[51px] bg-white/15 rounded-[73px] flex items-center justify-center text-[14px] text-white hover:bg-white/20 transition">
                        Cancel
                      </button>
                    </DialogClose>
                    <button
                      type="button"
                      onClick={() => {
                        handleSaveDraft();
                        setIsSaveDialogOpen(false);
                      }}
                      className="w-[142px] h-[51px] bg-gradient-to-br from-[#2186FF] to-[rgba(33,134,255,0.15)] rounded-[73px] flex items-center justify-center text-[14px] text-white hover:opacity-90 transition"
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
  );
};
