import { useQuery } from "@tanstack/react-query";
import { getMyNotifications, getUnreadNotificationCount } from "./notification.api";

export const NOTIFICATION_QUERY_KEYS = {
  all: ["notifications"] as const,
  lists: () => [...NOTIFICATION_QUERY_KEYS.all, "list"] as const,
  list: (page = 1, limit = 10) => [...NOTIFICATION_QUERY_KEYS.lists(), page, limit] as const,
  unreadCount: () => [...NOTIFICATION_QUERY_KEYS.all, "unread-count"] as const,
};

export const useMyNotifications = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.list(page, limit),
    queryFn: () => getMyNotifications(page, limit),
  });
};

export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.unreadCount(),
    queryFn: getUnreadNotificationCount,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time counts
  });
};



