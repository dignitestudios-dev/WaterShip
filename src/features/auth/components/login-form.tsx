"use client";

import { useLogin } from "../api/auth.mutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const loginMutation = useLogin();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data: LoginFormData) => {
    // Currently bypassing API call for frontend testing
    // loginMutation.mutate({ email: data.email, password: "" });
    router.push("/verify-email");
  };

  return (
    <div className="flex flex-col w-full max-w-[80%] mx-auto">
      <div className="flex flex-col gap-[25px] mb-8">
        <h1 className="font-semibold text-[40px] leading-[60px] tracking-[-0.025em] text-white">
          Get Started
        </h1>
        <p className="font-normal text-[16px] leading-[140%] text-[#E0E0E0]">
          Sign in to continue your onboarding journey.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="font-medium text-[14px] leading-[150%] text-white">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="client@adamsapp.com"
            {...register("email")}
            className="h-[51px] rounded-[72px] border-[#DDEBF8] bg-transparent text-white placeholder:text-[#E0E0E0]/50 px-6 focus-visible:ring-[#2186FF]"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="rounded-blue"
          className="w-full mt-2"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="flex items-center gap-2 my-8">
        <div className="flex-1 h-px bg-white/45"></div>
        <span className="font-normal text-[14px] text-white leading-[140%] px-2">OR</span>
        <div className="flex-1 h-px bg-white/45"></div>
      </div>

      <div className="flex flex-col gap-3">
        <Button variant="glass" className="w-full flex items-center justify-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
          </svg>
          Sign in with Google
        </Button>
        <Button variant="glass" className="w-full flex items-center justify-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.74 3.58-.79 1.58-.04 2.94.48 3.76 1.43-3.27 1.77-2.52 5.88.58 7.15-.71 1.9-1.95 3.39-2.99 4.38zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
          </svg>
          Sign in with Apple
        </Button>
      </div>

      <p className="mt-10 text-center font-normal text-[14px] leading-[140%] text-[#E0E0E0]">
        By clicking sign in you agreed to our{" "}
        <Link href="/terms" className="font-semibold underline hover:text-white transition-colors">terms of use</Link> &{" "}
        <Link href="/privacy" className="font-semibold underline hover:text-white transition-colors">privacy policy</Link>.
      </p>
    </div>
  );
};
