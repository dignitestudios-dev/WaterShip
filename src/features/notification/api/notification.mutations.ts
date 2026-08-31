import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationsAsRead } from "./notification.api";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-response";

export const useMarkNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids?: string[]) => markNotificationsAsRead(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: any) => {
      const message = getApiErrorMessage(error, "Failed to update notifications");
      toast.error(message);
    }
  });
};
