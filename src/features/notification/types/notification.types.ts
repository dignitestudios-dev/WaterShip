import { Pagination, ApiResponse } from "@/features/auth";

export interface NotificationItem {
  _id: string;
  user?: string;
  title: string;
  message?: string;
  body?: string;
  subtitle?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt?: string;
  type?: string;
  link?: string;
  data?: Record<string, any>;
  [key: string]: any;
}

export type Notification = NotificationItem;

export interface NotificationPaginationData {
  notifications?: NotificationItem[];
  docs?: NotificationItem[];
  items?: NotificationItem[];
  total?: number;
  pagination?: Pagination;
  unreadCount?: number;
}

export type UnreadCountResponseData =
  | number
  | { count?: number; unreadCount?: number; [key: string]: any };



