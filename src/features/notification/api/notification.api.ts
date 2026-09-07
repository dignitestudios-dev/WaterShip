import { api } from "@/lib/axios";
import { ApiResponse } from "@/features/auth";
import {
  NotificationItem,
  NotificationPaginationData,
  UnreadCountResponseData,
} from "../types/notification.types";

/**
 * 1. GET /notification/me?page=1&limit=10
 * Retrieves paginated notifications for the current authenticated user.
 */
export const getMyNotifications = async (
  page = 1,
  limit = 10
): Promise<ApiResponse<NotificationItem[] | NotificationPaginationData>> => {
  const { data } = await api.get<ApiResponse<NotificationItem[] | NotificationPaginationData>>(
    "/notification/me",
    {
      params: { page, limit },
    }
  );
  return data;
};

/**
 * 2. GET /notification/unread-count
 * Retrieves the count of unread notifications.
 */
export const getUnreadNotificationCount = async (): Promise<
  ApiResponse<UnreadCountResponseData>
> => {
  const { data } = await api.get<ApiResponse<UnreadCountResponseData>>(
    "/notification/unread-count"
  );
  return data;
};

/**
 * 3. PATCH /notification/:id/read
 * Marks a single notification as read by its ID.
 */
export const markNotificationAsRead = async (id: string): Promise<ApiResponse> => {
  const { data } = await api.patch<ApiResponse>(`/notification/${id}/read`);
  return data;
};

/**
 * 4. PATCH /notification/read-all
 * Marks all notifications for the current user as read.
 */
export const markAllNotificationsAsRead = async (): Promise<ApiResponse> => {
  const { data } = await api.patch<ApiResponse>("/notification/read-all");
  return data;
};

// Backward-compatibility alias
export const markNotificationsAsRead = markNotificationAsRead;



