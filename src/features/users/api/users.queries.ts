"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { completeProfile, getMe, updateProfile, getUsers, getUserById, deleteUser } from "./users.api";
import { CompleteProfilePayload, UpdateProfilePayload } from "../types/users.types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
      toast.success(data.message || "Profile completed successfully");
      queryClient.invalidateQueries({ queryKey: ["users", "me"] });
      router.push("/dashboard");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to complete profile");
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
      toast.error(error?.response?.data?.message || "Failed to update profile");
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
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete user");
    },
  });
};
