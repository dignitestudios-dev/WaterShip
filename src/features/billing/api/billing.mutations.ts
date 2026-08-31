import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  purchaseSubscription,
  cancelSubscription,
  addCard,
  setDefaultCard,
  deleteCard,
  createPayoutAccount,
  addBank,
  deleteBank
} from "./billing.api";
import { PurchaseSubscriptionPayload, AddCardPayload, AddBankPayload } from "../types/billing.types";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-response";

export const usePurchaseSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PurchaseSubscriptionPayload) => purchaseSubscription(payload),
    onSuccess: (data) => {
      toast.success(data?.message || "Subscription purchased successfully");
      queryClient.invalidateQueries({ queryKey: ["billing"] });
      queryClient.invalidateQueries({ queryKey: ["users", "me"] });
    },
    onError: (error: any) => {
      const message = getApiErrorMessage(error, "Failed to purchase subscription");
      toast.error(message);
    }
  });
};

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => cancelSubscription(),
    onSuccess: (data) => {
      toast.success(data?.message || "Subscription cancelled");
      queryClient.invalidateQueries({ queryKey: ["billing"] });
      queryClient.invalidateQueries({ queryKey: ["users", "me"] });
    },
    onError: (error: any) => {
      const message = getApiErrorMessage(error, "Failed to cancel subscription");
      toast.error(message);
    }
  });
};

export const useAddCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddCardPayload) => addCard(payload),
    onSuccess: (data) => {
      toast.success(data?.message || "Card added successfully");
      queryClient.invalidateQueries({ queryKey: ["billing", "cards"] });
    },
    onError: (error: any) => {
      const message = getApiErrorMessage(error, "Failed to add card");
      toast.error(message);
    }
  });
};

export const useSetDefaultCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => setDefaultCard(id),
    onSuccess: (data) => {
      toast.success(data?.message || "Default card updated");
      queryClient.invalidateQueries({ queryKey: ["billing", "cards"] });
    },
    onError: (error: any) => {
      const message = getApiErrorMessage(error, "Failed to set default card");
      toast.error(message);
    }
  });
};

export const useDeleteCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCard(id),
    onSuccess: (data) => {
      toast.success(data?.message || "Card removed successfully");
      queryClient.invalidateQueries({ queryKey: ["billing", "cards"] });
    },
    onError: (error: any) => {
      const message = getApiErrorMessage(error, "Failed to remove card");
      toast.error(message);
    }
  });
};

export const useCreatePayoutAccount = () => {
  return useMutation({
    mutationFn: () => createPayoutAccount(),
    onError: (error: any) => {
      const message = getApiErrorMessage(error, "Failed to create payout account");
      toast.error(message);
    }
  });
};

export const useAddBank = () => {
  return useMutation({
    mutationFn: (payload: AddBankPayload) => addBank(payload),
    onSuccess: (data) => {
      toast.success(data?.message || "Bank account added successfully");
    },
    onError: (error: any) => {
      const message = getApiErrorMessage(error, "Failed to add bank account");
      toast.error(message);
    }
  });
};

export const useDeleteBank = () => {
  return useMutation({
    mutationFn: (id: string) => deleteBank(id),
    onSuccess: (data) => {
      toast.success(data?.message || "Bank account removed");
    },
    onError: (error: any) => {
      const message = getApiErrorMessage(error, "Failed to remove bank account");
      toast.error(message);
    }
  });
};
