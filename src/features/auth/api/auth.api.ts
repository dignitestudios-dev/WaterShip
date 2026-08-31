import { api } from "@/lib/axios";
import { 
  ApiResponse, 
  AuthLoginPayload, 
  AuthLoginResponse, 
  AuthVerifyOtpPayload, 
  AuthVerifyOtpResponse,
  AuthUpdateFcmPayload,
  AuthDeleteConfirmPayload,
  AuthCheckEmailPayload,
  AuthCheckEmailResponse
} from "../types/auth.types";

export const authenticate = async (payload: AuthLoginPayload): Promise<ApiResponse<AuthLoginResponse>> => {
  const { data } = await api.post<ApiResponse<AuthLoginResponse>>("/auth", payload);
  return data;
};

export const verifyOtp = async (payload: AuthVerifyOtpPayload): Promise<ApiResponse<AuthVerifyOtpResponse>> => {
  const { data } = await api.post<ApiResponse<AuthVerifyOtpResponse>>("/auth/verify-otp", payload);
  return data;
};

export const resendOtp = async (email: string): Promise<ApiResponse> => {
  const { data } = await api.post<ApiResponse>("/auth/email-verification-otp", { email });
  return data;
};

export const checkEmail = async (payload: AuthCheckEmailPayload): Promise<ApiResponse<AuthCheckEmailResponse>> => {
  const { data } = await api.post<ApiResponse<AuthCheckEmailResponse>>("/auth/check-email", payload);
  return data;
};

export const updateFcm = async (payload: AuthUpdateFcmPayload): Promise<ApiResponse> => {
  const { data } = await api.post<ApiResponse>("/auth/update-fcm", payload);
  return data;
};

export const logout = async (): Promise<ApiResponse> => {
  const { data } = await api.post<ApiResponse>("/auth/logout");
  return data;
};

export const sendDeleteOtp = async (): Promise<ApiResponse> => {
  const { data } = await api.post<ApiResponse>("/auth/send-delete-otp");
  return data;
};

export const deleteAccount = async (payload: AuthDeleteConfirmPayload): Promise<ApiResponse> => {
  const { data } = await api.post<ApiResponse>("/auth/delete", payload);
  return data;
};
