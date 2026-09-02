import { api } from "@/lib/axios";
import { ApiResponse } from "@/features/auth";
import { AppSettings } from "../types/settings.types";

export const getSettings = async (): Promise<ApiResponse<AppSettings>> => {
  const { data } = await api.get<ApiResponse<AppSettings>>("/settings");
  return data;
};

export const updateSettings = async (payload: Partial<AppSettings>): Promise<ApiResponse<AppSettings>> => {
  const { data } = await api.patch<ApiResponse<AppSettings>>("/settings", payload);
  return data;
};
