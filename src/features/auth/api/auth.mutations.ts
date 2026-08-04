"use client";

import { useMutation } from "@tanstack/react-query";
import { login, register, logout } from "./auth.api";
import { AuthResponse, LoginCredentials, RegisterCredentials } from "../types/auth.types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const router = useRouter();

  return useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: login,
    onSuccess: (data) => {
      // Typically, you would save the token to cookies or state here
      // For this example, let's assume it's set in HttpOnly cookies by the backend
      // or we can set it here for the middleware to read
      document.cookie = `token=${data.token}; path=/`;
      toast.success("Logged in successfully");
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to login");
    },
  });
};

export const useRegister = () => {
  const router = useRouter();

  return useMutation<AuthResponse, Error, RegisterCredentials>({
    mutationFn: register,
    onSuccess: (data) => {
      document.cookie = `token=${data.token}; path=/`;
      toast.success("Registered successfully");
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to register");
    },
  });
};

export const useLogout = () => {
  const router = useRouter();

  return useMutation<void, Error, void>({
    mutationFn: logout,
    onSuccess: () => {
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      toast.success("Logged out");
      router.push("/login");
    },
  });
};
