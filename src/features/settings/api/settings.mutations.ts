import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSettings } from "./settings.api";
import { AppSettings } from "../types/settings.types";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-response";

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<AppSettings>) => updateSettings(payload),
    onSuccess: (data) => {
      toast.success("Settings updated successfully");
      queryClient.setQueryData(["settings"], data);
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (error: any) => {
      const message = getApiErrorMessage(error, "Failed to update settings");
      toast.error(message);
    }
  });
};
