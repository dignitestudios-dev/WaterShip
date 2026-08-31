"use client";

import { useMutation } from "@tanstack/react-query";
import { authenticate, verifyOtp, resendOtp, logout, checkEmail, updateFcm, sendDeleteOtp, deleteAccount } from "./auth.api";
import {
  AuthLoginPayload,
  AuthVerifyOtpPayload,
  AuthUpdateFcmPayload,
  AuthDeleteConfirmPayload,
  AuthCheckEmailPayload
} from "../types/auth.types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { setCookie, removeCookie } from "@/lib/cookie";

export const useAuthenticate = () => {
  return useMutation({
    mutationFn: authenticate,
    onSuccess: (data) => {
      // Social login returns token directly
      if (data.data?.token) {
        setCookie("token", data.data.token);
      }
      toast.success(data.message || "Authentication successful");
    },
    onError: (error: any) => {
      toast.error(error);
    },
  });
};

export const useVerifyOtp = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      if (data.data?.token) {
        setCookie("token", data.data.token);
      }
      toast.success(data.message || "OTP Verified Successfully");
      router.push("/dashboard");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Invalid or expired OTP");
    },
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: resendOtp,
    onSuccess: (data) => {
      toast.success(data.message || "OTP sent successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to resend OTP");
    },
  });
};

export const useLogout = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      removeCookie("token");
      toast.success("Logged out successfully");
      router.push("/login");
    },
    onError: (error: any) => {
      removeCookie("token"); // clear token anyway if backend fails
      router.push("/login");
    }
  });
};
