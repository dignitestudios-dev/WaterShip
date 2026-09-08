"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { completeProfile, getMe, updateProfile, getUsers, getUserById, deleteUser } from "./users.api";
import { CompleteProfilePayload, UpdateProfilePayload } from "../types/users.types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getApiErrorMessage } from "@/lib/api-response";
import { setCookie } from "@/lib/cookie";

export const useGetMe = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["users", "me"],
    queryFn: getMe,
    retry: 1,
    enabled: options?.enabled,
  });
};

export const useCompleteProfile = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeProfile,
    onSuccess: (data) => {
      setCookie("isProfileCompleted", "true");
      if (data?.data?.user) {
        queryClient.setQueryData(["users", "me"], {
          ...data,
          data: {
            ...data.data.user,
            isProfileCompleted: true,
          },
        });
      }
      queryClient.invalidateQueries({ queryKey: ["users", "me"] });
      toast.success(data.message || "Profile completed successfully");
      router.replace("/dashboard");
    },
    onError: (error: any) => {
      const message = getApiErrorMessage(error, "Failed to complete profile");
      toast.error(message);
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      toast.success(data.message || "Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["users", "me"] });
    },
    onError: (error: any) => {
      const message = getApiErrorMessage(error, "Failed to update profile");
      toast.error(message);
    },
  });
};

export const useGetUsers = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["users", { page, limit }],
    queryFn: () => getUsers(page, limit),
  });
};

export const useGetUserById = (id: string) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (data) => {
      toast.success(data?.message || "User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      const message = getApiErrorMessage(error, "Failed to delete user");
      toast.error(message);
    },
  });
};
