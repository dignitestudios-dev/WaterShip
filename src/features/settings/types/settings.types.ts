import { ApiResponse } from "@/features/auth";

export interface AppSettings {
  notificationsEnabled: boolean;
  theme: "light" | "dark" | "system";
  language: string;
  [key: string]: any; // Allow for extensibility if more settings come back
}
