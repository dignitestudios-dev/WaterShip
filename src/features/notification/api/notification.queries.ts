import { useQuery } from "@tanstack/react-query";
import { getMyNotifications, getUnreadNotificationCount } from "./notification.api";

export const useMyNotifications = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["notifications", "me", page, limit],
    queryFn: () => getMyNotifications(page, limit),
  });
};

export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey: ["notifications", "count"],
    queryFn: getUnreadNotificationCount,
    refetchInterval: 60000, // optionally refetch every minute
  });
};


