import { api } from "@/lib/axios";
import { AuthResponse, LoginCredentials, RegisterCredentials } from "../types/auth.types";

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/auth/login", credentials);
  return data;
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/auth/register", credentials);
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};
