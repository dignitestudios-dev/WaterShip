import { api } from "@/lib/axios";
import { ApiResponse } from "@/features/auth";
import { Notification } from "../types/notification.types";

// User Notifications
export const getMyNotifications = async (page = 1, limit = 10): Promise<ApiResponse<Notification[]>> => {
  const { data } = await api.get<ApiResponse<Notification[]>>(`/notification/me?page=${page}&limit=${limit}`);
  return data;
};

export const getUnreadNotificationCount = async (): Promise<ApiResponse<{ count: number }>> => {
  const { data } = await api.get<ApiResponse<{ count: number }>>("/notification/count");
  return data;
};

export const markNotificationsAsRead = async (ids?: string[]): Promise<ApiResponse> => {
  const { data } = await api.patch<ApiResponse>("/notification/read", { ids });
  return data;
};


