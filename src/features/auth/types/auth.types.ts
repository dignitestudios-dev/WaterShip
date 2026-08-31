export interface User {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  isEmailVerified: boolean;
  isProfileCompleted: boolean;
  profilePicture?: {
    _id: string;
    location: string;
    filename?: string;
    key?: string;
  };
  [key: string]: any;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: Pagination;
}

export interface AuthLoginPayload {
  method: "email" | "google" | "apple";
  email?: string;
  idToken?: string;
}

export interface AuthVerifyOtpPayload {
  email: string;
  otp: string;
}

export interface AuthLoginResponse {
  email?: string; // from email auth
  otpVerificationRequired: boolean;
  token?: string; // from social auth
  user?: User; // from social auth
}

export interface AuthVerifyOtpResponse {
  token: string;
  otpVerificationRequired: boolean;
  user: User;
}

export interface AuthUpdateFcmPayload {
  fcmToken: string;
}

export interface AuthDeleteConfirmPayload {
  otp: string;
}

export interface AuthCheckEmailPayload {
  email: string;
}

export interface AuthCheckEmailResponse {
  exists: boolean;
  isEmailVerified: boolean;
}
