import { useQuery } from "@tanstack/react-query";
import { getSubscriptionPlans, getCards, getTransactions } from "./billing.api";

export const useSubscriptionPlans = () => {
  return useQuery({
    queryKey: ["billing", "subscription-plans"],
    queryFn: getSubscriptionPlans,
  });
};

export const useCards = () => {
  return useQuery({
    queryKey: ["billing", "cards"],
    queryFn: getCards,
  });
};

export const useTransactions = (params: { page?: number; limit?: number; startDate?: string; endDate?: string; status?: string } = {}) => {
  return useQuery({
    queryKey: ["billing", "transactions", params],
    queryFn: () => getTransactions(params),
  });
};
