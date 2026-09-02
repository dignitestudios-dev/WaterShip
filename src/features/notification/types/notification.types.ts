import { Pagination, ApiResponse } from "@/features/auth";

export interface Notification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type?: string;
  link?: string;
}


