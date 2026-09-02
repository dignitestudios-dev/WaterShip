import { api } from "@/lib/axios";
import { User, ApiResponse } from "@/features/auth";
import { CompleteProfilePayload, UpdateProfilePayload } from "../types/users.types";

export const completeProfile = async (payload: CompleteProfilePayload): Promise<ApiResponse<{ user: User }>> => {
  const formData = new FormData();
  if (payload.firstName) formData.append("firstName", payload.firstName);
  if (payload.lastName) formData.append("lastName", payload.lastName);
  if (payload.phone) formData.append("phone", payload.phone);
  if (payload.dob) formData.append("dob", payload.dob);
  if (payload.primaryAddress) formData.append("primaryAddress", payload.primaryAddress);
  if (payload.profilePicture) formData.append("profilePicture", payload.profilePicture);

  const { data } = await api.post<ApiResponse<{ user: User }>>("/users/complete-profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const getMe = async (): Promise<ApiResponse<User>> => {
  const { data } = await api.get<ApiResponse<User>>("/users/me");
  return data;
};

export const updateProfile = async (payload: UpdateProfilePayload): Promise<ApiResponse> => {
  const formData = new FormData();
  if (payload.firstName) formData.append("firstName", payload.firstName);
  if (payload.lastName) formData.append("lastName", payload.lastName);
  if (payload.phone) formData.append("phone", payload.phone);
  if (payload.dob) formData.append("dob", payload.dob);
  if (payload.primaryAddress) formData.append("primaryAddress", payload.primaryAddress);
  if (payload.profilePicture) formData.append("profilePicture", payload.profilePicture);

  const { data } = await api.patch<ApiResponse>("/users", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const getUsers = async (page = 1, limit = 10): Promise<ApiResponse<User[]>> => {
  const { data } = await api.get<ApiResponse<User[]>>(`/users?page=${page}&limit=${limit}`);
  return data;
};

export const getUserById = async (id: string): Promise<ApiResponse<User>> => {
  const { data } = await api.get<ApiResponse<User>>(`/users/${id}`);
  return data;
};

export const deleteUser = async (id: string): Promise<ApiResponse> => {
  const { data } = await api.delete<ApiResponse>(`/users/${id}`);
  return data;
};
