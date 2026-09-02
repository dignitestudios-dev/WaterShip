"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Loader2, Check } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useVerifyOtp, useResendOtp } from "../api/auth.mutations";
import { useEffect } from "react";

const verifySchema = z.object({
  code1: z.string().min(1),
  code2: z.string().min(1),
  code3: z.string().min(1),
  code4: z.string().min(1),
});

type VerifyFormData = z.infer<typeof verifySchema>;

export const VerifyEmailForm :any = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const verifyMutation = useVerifyOtp();
  const resendMutation = useResendOtp();
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [resendTimer, setResendTimer] = useState<number>(30);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const { register, handleSubmit, watch, setValue } = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
    defaultValues: { code1: "", code2: "", code3: "", code4: "" },
  });

  const codes = watch(["code1", "code2", "code3", "code4"]);
  const isValid = codes.every((code) => code.length === 1);

  const onSubmit = (data: VerifyFormData) => {
    if (!email) {
      router.push("/login");
      return;
    }
    
    setStatus("loading");
    const otp = `${data.code1}${data.code2}${data.code3}${data.code4}`;
    
    verifyMutation.mutate(
      { email, otp },
      {
        onSuccess: (data) => {
          setStatus("success");
          if(data?.data?.user?.isProfileCompleted){
            router.push("/dashboard");
          }
          else{
              router.push("/complete-profile");
          }
        },
        onError: () => {
          setStatus("idle");
        }
      }
    );
  };

  const handleResend = () => {
    if (!email || resendTimer > 0 || resendMutation.isPending) return;
    resendMutation.mutate(email, {
      onSuccess: () => {
        setResendTimer(30);
      },
    });
  };

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    nextField: string | null,
    prevField: string | null,
    currentField: keyof VerifyFormData
  ) => {
    // Only allow numbers
    const val = e.target.value.replace(/[^0-9]/g, '');
    
    if (val.length === 0) {
      setValue(currentField, "");
      return;
    }

    if (val.length > 1) {
      setValue(currentField, val.slice(-1));
    } else {
      setValue(currentField, val);
    }

    if (val.length >= 1 && nextField) {
      const nextInput = document.querySelector(`input[name="${nextField}"]`) as HTMLInputElement;
      nextInput?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    prevField: string | null
  ) => {
    if (e.key === "Backspace" && e.currentTarget.value === "" && prevField) {
      const prevInput = document.querySelector(`input[name="${prevField}"]`) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  return (
    <>
      <Dialog open={status !== "idle"} onOpenChange={() => {}}>
        <DialogContent className="max-w-[375px] h-[340px] border-none rounded-[32px] bg-gradient-to-b from-[#034593] to-[#01152D] shadow-[0px_4px_30px_rgba(33,134,255,0.15)] flex flex-col items-center justify-center p-0 [&>button]:hidden">
          {status === "loading" && (
            <div className="flex flex-col items-center justify-center text-center gap-[25px]">
              <Loader2 className="w-[60px] h-[60px] text-white animate-spin mb-4" />
              <h1 className="font-semibold text-[24px] leading-[36px] tracking-[-0.025em] text-white">
                Verifying Your Email
              </h1>
              <p className="font-normal text-[14px] leading-[21px] text-[#E0E0E0] px-6">
                We're verifying your email. Please wait a moment.
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center justify-center text-center gap-[30px]">
              <div className="w-[80px] h-[80px] bg-white/15 rounded-full flex items-center justify-center">
                <Check className="w-[40px] h-[40px] text-white" strokeWidth={3} />
              </div>
              <div className="flex flex-col gap-2 px-6">
                <h1 className="font-semibold text-[20px] leading-[30px] tracking-[-0.025em] text-white">
                  Email Verified
                </h1>
                <p className="font-normal text-[14px] leading-[21px] text-[#E0E0E0]">
                  Your email has been successfully verified. You can now continue to your account.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <div className="flex flex-col w-full max-w-[80%] mx-auto relative -top-12">
        {/* Back Button */}
        <div className="absolute -top-[60px] -left-0">
          <Link 
            href="/login" 
            className="w-[30px] h-[30px] flex items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex flex-col gap-[25px] mb-[40px]">
          <h1 className="font-semibold text-[40px] leading-[60px] tracking-[-0.025em] text-white">
            Verify Email
          </h1>
          <p className="font-normal text-[16px] leading-[140%] text-[#E0E0E0]">
            Enter the code sent to {email || "*****@example.com"}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[40px]">
          <div className="flex items-center justify-center gap-[14px]">
            <Input
              {...register("code1")}
              onChange={(e) => handleInput(e, "code2", null, "code1")}
              onKeyDown={(e) => handleKeyDown(e, null)}
              className="w-[66px] h-[75px] bg-white/15 border-none rounded-[12px] text-center text-white text-2xl font-semibold focus-visible:ring-1 focus-visible:ring-[#2186FF]"
              maxLength={2}
              inputMode="numeric"
              type="text"
            />
            <Input
              {...register("code2")}
              onChange={(e) => handleInput(e, "code3", "code1", "code2")}
              onKeyDown={(e) => handleKeyDown(e, "code1")}
              className="w-[66px] h-[75px] bg-white/15 border-none rounded-[12px] text-center text-white text-2xl font-semibold focus-visible:ring-1 focus-visible:ring-[#2186FF]"
              maxLength={2}
              inputMode="numeric"
              type="text"
            />
            <Input
              {...register("code3")}
              onChange={(e) => handleInput(e, "code4", "code2", "code3")}
              onKeyDown={(e) => handleKeyDown(e, "code2")}
              className="w-[66px] h-[75px] bg-white/15 border-none rounded-[12px] text-center text-white text-2xl font-semibold focus-visible:ring-1 focus-visible:ring-[#2186FF]"
              maxLength={2}
              inputMode="numeric"
              type="text"
            />
            <Input
              {...register("code4")}
              onChange={(e) => handleInput(e, null, "code3", "code4")}
              onKeyDown={(e) => handleKeyDown(e, "code3")}
              className="w-[66px] h-[75px] bg-white/15 border-none rounded-[12px] text-center text-white text-2xl font-semibold focus-visible:ring-1 focus-visible:ring-[#2186FF]"
              maxLength={2}
              inputMode="numeric"
              type="text"
            />
          </div>

          <Button
            type="submit"
            variant="rounded-blue"
            className="w-full"
            disabled={!isValid || verifyMutation.isPending}
            style={{ opacity: isValid && !verifyMutation.isPending ? 1 : 0.65 }}
          >
            {verifyMutation.isPending ? "Verifying..." : "Verify Email"}
          </Button>
          
          <p className="text-center font-normal text-[14px] leading-[21px] text-[#E0E0E0]">
            Didn't receive code?{" "}
            {resendTimer > 0 ? (
              <span className="font-semibold text-white/70">
                Resend in 0:{resendTimer < 10 ? `0${resendTimer}` : resendTimer}
              </span>
            ) : (
              <span
                onClick={handleResend}
                className="font-semibold text-white cursor-pointer hover:underline"
              >
                {resendMutation.isPending ? "Resending..." : "Resend Code"}
              </span>
            )}
          </p>
        </form>
      </div>
    </>
  );
};
