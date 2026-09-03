"use client";

import { useAuthenticate } from "../api/auth.mutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { signInWithGoogle, signInWithApple } from "@/firebase";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const loginMutation = useAuthenticate();
  const router = useRouter();
  const [socialProvider, setSocialProvider] = useState<"google" | "apple" | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(
      { method: "email", email: data.email },
      {
        onSuccess: (res) => {
          if (res.data?.otpVerificationRequired) {
            router.push("/verify-email?email=" + encodeURIComponent(data.email));
          } else if (res.data?.token) {
            if (res.data.user && !res.data.user.isProfileCompleted) {
              router.push("/complete-profile");
            } else {
              router.push("/dashboard");
            }
          }
        }
      }
    );
  };

  const handleSocialLogin = async (provider: "google" | "apple") => {
    try {
      setSocialProvider(provider);
      const idToken = provider === "google" 
        ? await signInWithGoogle() 
        : await signInWithApple();

      if (!idToken) {
        toast.error("Failed to retrieve authentication token");
        setSocialProvider(null);
        return;
      }

      loginMutation.mutate(
        { method: provider, idToken },
        {
          onSuccess: (res) => {
            setSocialProvider(null);
            if (res.data?.token) {
              if (res.data.user && !res.data.user.isProfileCompleted) {
                router.push("/complete-profile");
              } else {
                router.push("/dashboard");
              }
            }
          },
          onError: () => {
            setSocialProvider(null);
          },
        }
      );
    } catch (error: any) {
      setSocialProvider(null);
      // Suppress alert if user deliberately closed popup
      if (error?.code === "auth/popup-closed-by-user" || error?.code === "auth/cancelled-popup-request") {
        return;
      }
      toast.error(error?.message || `Failed to sign in with ${provider === "google" ? "Google" : "Apple"}`);
    }
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
          disabled={loginMutation.isPending || socialProvider !== null}
        >
          {loginMutation.isPending && !socialProvider ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="flex items-center gap-2 my-8">
        <div className="flex-1 h-px bg-white/45"></div>
        <span className="font-normal text-[14px] text-white leading-[140%] px-2">OR</span>
        <div className="flex-1 h-px bg-white/45"></div>
      </div>

      <div className="flex flex-col gap-3">
        <Button 
          type="button"
          onClick={() => handleSocialLogin("google")}
          disabled={loginMutation.isPending || socialProvider !== null}
          variant="glass" 
          className="w-full flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          {socialProvider === "google" ? "Connecting to Google..." : "Sign in with Google"}
        </Button>
        <Button 
          type="button"
          onClick={() => handleSocialLogin("apple")}
          disabled={loginMutation.isPending || socialProvider !== null}
          variant="glass" 
          className="w-full flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.74 3.58-.79 1.58-.04 2.94.48 3.76 1.43-3.27 1.77-2.52 5.88.58 7.15-.71 1.9-1.95 3.39-2.99 4.38zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
          {socialProvider === "apple" ? "Connecting to Apple..." : "Sign in with Apple"}
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

