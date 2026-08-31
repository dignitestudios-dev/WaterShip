import { Pagination, ApiResponse } from "@/features/auth";

export interface SubscriptionPlan {
  _id: string;
  name: string;
  price: number;
  features: string[];
  // Additional fields based on actual implementation
}

export interface PaymentCard {
  _id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export interface BankAccount {
  _id: string;
  bankName: string;
  last4: string;
  accountHolderName: string;
}

export interface Transaction {
  _id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

export interface AddCardPayload {
  token: string;
}

export interface PurchaseSubscriptionPayload {
  planId: string;
}

export interface AddBankPayload {
  accountNumber: string;
  routingNumber: string;
  accountHolderName: string;
}
