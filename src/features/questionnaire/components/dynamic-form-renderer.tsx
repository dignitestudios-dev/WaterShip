"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { QuestionnaireQuestion, QuestionnaireOption } from "@/features/onboarding/types/onboarding.types";
import { format } from "date-fns";
import { CalendarIcon, Check, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

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
  initialValues?: Record<string, any>;
  onComplete: (data: any) => void;
  onSaveDraft: (data: any) => void;
  isSubmitting?: boolean;
}

const normalizeOptions = (options?: (string | QuestionnaireOption)[]): QuestionnaireOption[] => {
  if (!options || !Array.isArray(options)) return [];
  return options.map((opt) => (typeof opt === "string" ? { label: opt, value: opt } : opt));
};

const isValidDate = (val: any) => {
  if (!val) return false;
  const d = new Date(val);
  return !isNaN(d.getTime());
};

const isEmailField = (q: QuestionnaireQuestion) => {
  const type = (q.type || "").toLowerCase().trim();
  return type === "email";
};

const isPhoneField = (q: QuestionnaireQuestion) => {
  const type = (q.type || "").toLowerCase().trim();
  return type === "phone" || type === "tel";
};

const formatPhoneNumber = (val: string): string => {
  if (!val) return "";
  let digits = val.replace(/\D/g, "");
  if (digits.startsWith("1") && digits.length > 10) {
    digits = digits.slice(1);
  }
  digits = digits.slice(0, 10);
  if (!digits) return "";
  if (digits.length <= 3) {
    return `+1 (${digits}`;
  }
  if (digits.length <= 6) {
    return `+1 (${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }
  return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export const DynamicFormRenderer = ({ questions, initialValues, onComplete, onSaveDraft, isSubmitting }: DynamicFormRendererProps) => {
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  // Dynamically build Zod schema that correctly validates conditional questions only when active
  const generateSchema = (qs: QuestionnaireQuestion[]) => {
    return z.record(z.string(), z.any()).superRefine((data, ctx) => {
      const validateQuestion = (q: QuestionnaireQuestion) => {
        const val = data[q.questionId];
        const strVal = val !== undefined && val !== null ? String(val).trim() : "";

        if (isEmailField(q)) {
          if (q.required && !strVal) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Email address is required",
              path: [q.questionId],
            });
          } else if (strVal) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(strVal)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Please enter a valid email address (e.g. name@example.com)",
                path: [q.questionId],
              });
            }
          }
        } else if (isPhoneField(q)) {
          const digits = strVal.replace(/\D/g, "");
          const effectiveDigits = digits.startsWith("1") && digits.length === 11 ? digits.slice(1) : digits;
          if (q.required && !strVal) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Phone number is required",
              path: [q.questionId],
            });
          } else if (strVal) {
            if (effectiveDigits.length < 10) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Please enter a valid 10-digit phone number",
                path: [q.questionId],
              });
            }
          }
        } else if (q.required) {
          if (q.type === "checkbox") {
            const hasOptions = q.options && q.options.length > 0;
            if (hasOptions) {
              const arr = Array.isArray(val) ? val : val ? [val] : [];
              if (arr.length === 0) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: "Please select at least one option",
                  path: [q.questionId],
                });
              }
            } else {
              if (val !== true && val !== "true" && val !== "Yes") {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: "Must be checked",
                  path: [q.questionId],
                });
              }
            }
          } else if (q.type === "date") {
            if (!val) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "This field is required",
                path: [q.questionId],
              });
            }
          } else {
            if (!strVal) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "This field is required",
                path: [q.questionId],
              });
            }
          }
        }

        // Check and validate conditional questions if active
        if (q.conditionalLogic && Array.isArray(q.conditionalLogic)) {
          q.conditionalLogic.forEach((cond) => {
            const triggerVal = cond.triggerValue ?? cond.dependsOnValue;
            const isTriggerMatch =
              val !== undefined &&
              val !== null &&
              val !== "" &&
              triggerVal !== undefined &&
              triggerVal !== null &&
              (Array.isArray(val)
                ? val.some((v) => String(v).trim().toLowerCase() === String(triggerVal).trim().toLowerCase())
                : String(triggerVal).trim().toLowerCase() === String(val).trim().toLowerCase());

            if (isTriggerMatch && cond.questions && Array.isArray(cond.questions)) {
              cond.questions.forEach(validateQuestion);
            }
          });
        }
      };

      qs.forEach(validateQuestion);
    });
  };

  const dynamicSchema = generateSchema(questions);

  const form = useForm<Record<string, any>>({
    resolver: zodResolver(dynamicSchema),
    defaultValues: initialValues || {},
    reValidateMode: "onChange",
  });

  // Sync form values whenever initial values load or change
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      form.reset(initialValues);
    }
  }, [initialValues, form]);

  // Recursively collect all visible questions in natural sequential order
  const getVisibleQuestions = (qs: QuestionnaireQuestion[]): QuestionnaireQuestion[] => {
    const list: QuestionnaireQuestion[] = [];

    const collect = (q: QuestionnaireQuestion) => {
      list.push(q);

      const val = form.watch(q.questionId);
      if (q.conditionalLogic && val !== undefined && val !== null && val !== "") {
        const activeConditions = q.conditionalLogic.filter((cond) => {
          const triggerVal = cond.triggerValue ?? cond.dependsOnValue;
          if (triggerVal === undefined || triggerVal === null) return false;
          if (Array.isArray(val)) {
            return val.some((v) => String(v).trim().toLowerCase() === String(triggerVal).trim().toLowerCase());
          }
          return String(triggerVal).trim().toLowerCase() === String(val).trim().toLowerCase();
        });

        activeConditions.forEach((cond) => {
          if (cond.questions && Array.isArray(cond.questions)) {
            cond.questions.forEach(collect);
          }
        });
      }
    };

    qs.forEach(collect);
    return list;
  };

  const visibleQuestions = getVisibleQuestions(questions);

  const getFilteredValues = (rawValues: Record<string, any>) => {
    const visibleIds = new Set(visibleQuestions.map((q) => q.questionId));
    const filtered: Record<string, any> = {};
    for (const key of Object.keys(rawValues)) {
      if (visibleIds.has(key) && rawValues[key] !== undefined && rawValues[key] !== null && rawValues[key] !== "") {
        filtered[key] = rawValues[key];
      }
    }
    return filtered;
  };

  const onSubmit = (data: any) => {
    onComplete(getFilteredValues(data));
  };

  const handleSaveDraft = () => {
    onSaveDraft(getFilteredValues(form.getValues()));
  };

  const renderField = (q: QuestionnaireQuestion) => {
    const options = normalizeOptions(q.options);

    return (
      <div
        key={q.questionId}
        className="flex flex-col gap-[8px] w-full animate-in fade-in zoom-in-95 duration-200"
      >
        <FormField
          control={form.control}
          name={q.questionId}
          render={({ field }) => (
            <FormItem
              className={
                q.type === "checkbox" && options.length === 0
                  ? "flex flex-row items-center justify-start space-x-3 space-y-0 pt-6"
                  : "flex flex-col"
              }
            >
              {(q.type !== "checkbox" || options.length > 0) && (
                <FormLabel className="text-white font-medium text-[16px] leading-[22px] min-h-[44px] flex items-end pb-[6px]">
                  <span>{q.text}</span>
                  {q.required && <span className="text-[#D11D21] ml-1">*</span>}
                </FormLabel>
              )}

              {/* Email Input */}
              {isEmailField(q) && (
                <FormControl>
                  <div className="relative w-full">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                    <Input
                      type="email"
                      placeholder={q.hintText || "name@example.com"}
                      {...field}
                      value={typeof field.value === "string" ? field.value : ""}
                      className="bg-white/15 border-none rounded-[7px] text-white placeholder:text-white/50 h-[40px]! w-full pl-9"
                    />
                  </div>
                </FormControl>
              )}

              {/* Phone Input */}
              {isPhoneField(q) && (
                <FormControl>
                  <div className="relative w-full">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                    <Input
                      type="tel"
                      placeholder={q.hintText || "+1 (555) 000-0000"}
                      {...field}
                      value={typeof field.value === "string" ? field.value : ""}
                      onChange={(e) => {
                        const formatted = formatPhoneNumber(e.target.value);
                        field.onChange(formatted);
                      }}
                      className="bg-white/15 border-none rounded-[7px] text-white placeholder:text-white/50 h-[40px]! w-full pl-9 font-medium"
                    />
                  </div>
                </FormControl>
              )}

              {/* Text / Number Input */}
              {!isEmailField(q) && !isPhoneField(q) && (q.type === "text" || q.type === "number") && (
                <FormControl>
                  <Input
                    type={q.type === "number" ? "number" : "text"}
                    placeholder={q.hintText || "Enter answer"}
                    {...field}
                    value={typeof field.value === "string" || typeof field.value === "number" ? field.value : ""}
                    className="bg-white/15 border-none rounded-[7px] text-white placeholder:text-white/50 h-[40px]! w-full"
                  />
                </FormControl>
              )}

              {/* Radio Group / Pills */}
              {q.type === "radio" && (
                <FormControl>
                  <div className="flex flex-wrap items-center gap-[10px]">
                    {options.map((opt, i) => {
                      const isSelected = String(field.value ?? "").toLowerCase() === String(opt.value).toLowerCase();
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => field.onChange(opt.value)}
                          className={cn(
                            "h-[40px] px-5 rounded-[7px] text-[14px] font-medium transition-all flex items-center justify-center cursor-pointer border",
                            isSelected
                              ? "bg-[#2186FF] text-white border-[#2186FF] shadow-[0px_0px_15px_rgba(33,134,255,0.4)]"
                              : "bg-white/15 text-white border-transparent hover:bg-white/20"
                          )}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </FormControl>
              )}

              {/* Chips / Multi-choice Pills */}
              {q.type === "chips" && (
                <FormControl>
                  <div className="flex flex-wrap items-center gap-[10px]">
                    {options.map((opt, i) => {
                      const isSelected = String(field.value ?? "").toLowerCase() === String(opt.value).toLowerCase();
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => field.onChange(opt.value)}
                          className={cn(
                            "h-[36px] px-4 rounded-[20px] text-[13px] font-medium transition-all flex items-center justify-center cursor-pointer border",
                            isSelected
                              ? "bg-[#2186FF] text-white border-[#2186FF] shadow-[0px_0px_15px_rgba(33,134,255,0.4)]"
                              : "bg-white/15 text-white border-transparent hover:bg-white/20"
                          )}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </FormControl>
              )}

              {/* Select / Dropdown */}
              {(q.type === "select" || q.type === "dropdown") && (
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className="bg-white/15 border-none rounded-[7px] text-white h-[40px]! w-full [&_svg]:text-white">
                      <SelectValue placeholder={q.hintText || "Select"} className="text-white" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-[#034593] text-white border border-white/20 max-h-[250px] shadow-xl">
                    {options.map((opt, i) => (
                      <SelectItem
                        key={i}
                        value={opt.value}
                        className="text-white focus:bg-white/20 focus:text-white cursor-pointer"
                      >
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Date */}
              {q.type === "date" && (
                <Popover>
                  <PopoverTrigger>
                    <Button
                      type="button"
                      variant={"outline"}
                      className={cn(
                        "w-full h-[40px]! bg-white/15 border-none rounded-[7px] text-left font-normal hover:bg-white/20 hover:text-white",
                        !isValidDate(field.value) ? "text-[#E0E0E0]" : "text-white"
                      )}
                    >
                      {isValidDate(field.value) ? (
                        format(new Date(field.value), "d MMMM yyyy")
                      ) : (
                        <span>{q.hintText || "Pick a date"}</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50 text-[#E0E0E0]" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={isValidDate(field.value) ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ? date.toISOString() : undefined)}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    />
                  </PopoverContent>
                </Popover>
              )}

              {/* Checkbox Group */}
              {q.type === "checkbox" && options.length > 0 && (
                <FormControl>
                  <div className="flex flex-wrap items-center gap-[15px] pt-1">
                    {options.map((opt, i) => {
                      const currentValues: string[] = Array.isArray(field.value)
                        ? field.value
                        : field.value
                        ? [String(field.value)]
                        : [];
                      const isChecked = currentValues.some(
                        (v) => String(v).trim().toLowerCase() === String(opt.value).trim().toLowerCase()
                      );

                      return (
                        <label
                          key={i}
                          className="flex items-center gap-2 cursor-pointer select-none"
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              let nextValues: string[];
                              if (checked) {
                                nextValues = [...currentValues, String(opt.value)];
                              } else {
                                nextValues = currentValues.filter(
                                  (v) => String(v).trim().toLowerCase() !== String(opt.value).trim().toLowerCase()
                                );
                              }
                              field.onChange(nextValues);
                            }}
                            className="bg-transparent border-white/30 data-checked:!bg-[#2186FF] data-checked:!border-[#2186FF] data-checked:text-white rounded-[4px]"
                          />
                          <span className="text-[#E0E0E0] text-[14px] font-medium leading-[21px]">
                            {opt.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </FormControl>
              )}

              {/* Single Boolean Checkbox */}
              {q.type === "checkbox" && options.length === 0 && (
                <>
                  <FormControl>
                    <Checkbox
                      checked={field.value === true || field.value === "true" || field.value === "Yes" || Boolean(field.value)}
                      onCheckedChange={field.onChange}
                      className="bg-transparent border-white/30 data-checked:!bg-[#2186FF] data-checked:!border-[#2186FF] data-checked:text-white rounded-[4px]"
                    />
                  </FormControl>
                  <FormLabel className="text-[#E0E0E0] font-medium text-[14px] leading-[21px] cursor-pointer">
                    {q.text}
                    {q.required && <span className="text-[#D11D21] ml-1">*</span>}
                  </FormLabel>
                </>
              )}

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  };

  return (
    <div className="w-[90%] lg:w-[80%] mt-[30px] z-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-[30px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-[30px] gap-y-[30px] w-full">
            {visibleQuestions.map(renderField)}
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
                disabled={isSubmitting}
                className="w-[167px] h-[42px] rounded-[96px] bg-gradient-to-br from-[#2186FF] to-[rgba(33,134,255,0.15)] text-[#DDEBF8] hover:opacity-90 font-bold text-[14px] border-none disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Continue"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
