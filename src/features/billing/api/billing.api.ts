import { api } from "@/lib/axios";
import { ApiResponse } from "@/features/auth";
import {
  SubscriptionPlan,
  PaymentCard,
  BankAccount,
  Transaction,
  AddCardPayload,
  PurchaseSubscriptionPayload,
  AddBankPayload
} from "../types/billing.types";

export const getSubscriptionPlans = async (): Promise<ApiResponse<SubscriptionPlan[]>> => {
  const { data } = await api.get<ApiResponse<SubscriptionPlan[]>>("/billing/subscription-plans");
  return data;
};

export const purchaseSubscription = async (payload: PurchaseSubscriptionPayload): Promise<ApiResponse> => {
  const { data } = await api.post<ApiResponse>("/billing/subscription-purchase", payload);
  return data;
};

export const cancelSubscription = async (): Promise<ApiResponse> => {
  const { data } = await api.post<ApiResponse>("/billing/subscription-cancel");
  return data;
};

export const getCards = async (): Promise<ApiResponse<PaymentCard[]>> => {
  const { data } = await api.get<ApiResponse<PaymentCard[]>>("/billing/cards");
  return data;
};

export const addCard = async (payload: AddCardPayload): Promise<ApiResponse<PaymentCard>> => {
  const { data } = await api.post<ApiResponse<PaymentCard>>("/billing/add-card", payload);
  return data;
};

export const setDefaultCard = async (id: string): Promise<ApiResponse> => {
  const { data } = await api.post<ApiResponse>(`/billing/default-card/${id}`);
  return data;
};

export const deleteCard = async (id: string): Promise<ApiResponse> => {
  const { data } = await api.post<ApiResponse>(`/billing/delete-card/${id}`);
  return data;
};

export const createPayoutAccount = async (): Promise<ApiResponse> => {
  const { data } = await api.post<ApiResponse>("/billing/create-account");
  return data;
};

export const addBank = async (payload: AddBankPayload): Promise<ApiResponse<BankAccount>> => {
  const { data } = await api.post<ApiResponse<BankAccount>>("/billing/add-bank", payload);
  return data;
};

export const deleteBank = async (id: string): Promise<ApiResponse> => {
  const { data } = await api.delete<ApiResponse>(`/billing/delete-bank/${id}`);
  return data;
};

export const getTransactions = async (params: { page?: number; limit?: number; startDate?: string; endDate?: string; status?: string }): Promise<ApiResponse<Transaction[]>> => {
  const { data } = await api.get<ApiResponse<Transaction[]>>("/billing/transactions", { params });
  return data;
};
