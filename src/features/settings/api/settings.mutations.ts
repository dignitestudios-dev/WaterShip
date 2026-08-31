import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSettings } from "./settings.api";
import { AppSettings } from "../types/settings.types";

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<AppSettings>) => updateSettings(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(["settings"], data);
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
};
