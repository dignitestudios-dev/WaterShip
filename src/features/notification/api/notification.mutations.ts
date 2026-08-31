import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationsAsRead } from "./notification.api";


export const useMarkNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids?: string[]) => markNotificationsAsRead(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};


