"use client";

import { useMutation } from "@tanstack/react-query";
import {
  authenticate,
  verifyOtp,
  resendOtp,
  logout,
  checkEmail,
  updateFcm,
  sendDeleteOtp,
  deleteAccount,
} from "./auth.api";
import {
  AuthLoginPayload,
  AuthVerifyOtpPayload,
  AuthUpdateFcmPayload,
  AuthDeleteConfirmPayload,
  AuthCheckEmailPayload,
} from "../types/auth.types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { setCookie, removeCookie } from "@/lib/cookie";
import { getApiErrorMessage } from "@/lib/api-response";

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
      const message = getApiErrorMessage(error, "Authentication failed");
      toast.error(message);
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
      const message = getApiErrorMessage(error, "Invalid or expired OTP");
      toast.error(message);
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
      const message = getApiErrorMessage(error, "Failed to resend OTP");
      toast.error(message);
    },
  });
};

export const useCheckEmail = () => {
  return useMutation({
    mutationFn: checkEmail,
    onError: (error: any) => {
      const message = getApiErrorMessage(error, "Failed to verify email");
      toast.error(message);
    },
  });
};

export const useUpdateFcm = () => {
  return useMutation({
    mutationFn: updateFcm,
    onError: (error: any) => {
      const message = getApiErrorMessage(error, "Failed to update notification settings");
      toast.error(message);
    },
  });
};

export const useSendDeleteOtp = () => {
  return useMutation({
    mutationFn: sendDeleteOtp,
    onSuccess: (data) => {
      toast.success(data.message || "Delete confirmation code sent");
    },
    onError: (error: any) => {
      const message = getApiErrorMessage(error, "Failed to send delete verification code");
      toast.error(message);
    },
  });
};

export const useDeleteAccount = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: (data) => {
      removeCookie("token");
      toast.success(data.message || "Account deleted successfully");
      router.push("/login");
    },
    onError: (error: any) => {
      const message = getApiErrorMessage(error, "Failed to delete account");
      toast.error(message);
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
      const message = getApiErrorMessage(error, "Logged out");
      toast.error(message);
      router.push("/login");
    },
  });
};
