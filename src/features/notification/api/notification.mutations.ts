import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "./notification.api";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-response";
import { NOTIFICATION_QUERY_KEYS } from "./notification.queries";

/**
 * Mutation to mark a single notification as read (PATCH /notification/:id/read)
 */
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all });
    },
    onError: (error: any) => {
      const message = getApiErrorMessage(error, "Failed to mark notification as read");
      toast.error(message);
    },
  });
};

/**
 * Mutation to mark all notifications as read (PATCH /notification/read-all)
 */
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => markAllNotificationsAsRead(),
    onSuccess: () => {
      toast.success("All notifications marked as read");
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all });
    },
    onError: (error: any) => {
      const message = getApiErrorMessage(error, "Failed to mark all notifications as read");
      toast.error(message);
    },
  });
};

// Backward-compatibility alias
export const useMarkNotificationsAsRead = useMarkNotificationAsRead;

