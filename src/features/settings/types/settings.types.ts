import { ApiResponse } from "@/features/auth";

export interface AppSettings {
  _id?: string;
  user?: string;
  isNotificationEnabled: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface UpdateSettingsPayload {
  isNotificationEnabled?: boolean;
  [key: string]: any;
}
