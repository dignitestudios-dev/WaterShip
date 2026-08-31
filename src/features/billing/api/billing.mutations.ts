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

export const usePurchaseSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PurchaseSubscriptionPayload) => purchaseSubscription(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing"] });
      queryClient.invalidateQueries({ queryKey: ["users", "me"] });
    },
  });
};

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => cancelSubscription(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing"] });
      queryClient.invalidateQueries({ queryKey: ["users", "me"] });
    },
  });
};

export const useAddCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddCardPayload) => addCard(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing", "cards"] });
    },
  });
};

export const useSetDefaultCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => setDefaultCard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing", "cards"] });
    },
  });
};

export const useDeleteCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing", "cards"] });
    },
  });
};

export const useCreatePayoutAccount = () => {
  return useMutation({
    mutationFn: () => createPayoutAccount(),
  });
};

export const useAddBank = () => {
  return useMutation({
    mutationFn: (payload: AddBankPayload) => addBank(payload),
  });
};

export const useDeleteBank = () => {
  return useMutation({
    mutationFn: (id: string) => deleteBank(id),
  });
};
