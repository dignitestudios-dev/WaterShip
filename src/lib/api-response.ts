import { toast } from "sonner";

/**
 * Standard API error response interface
 */
export interface ApiErrorData {
  success?: boolean;
  message?: string;
  error?: string;
  errors?: Array<string | { msg?: string; message?: string }>;
  [key: string]: any;
}

/**
 * Standard API response interface
 */
export interface ApiResponsePayload<T = any> {
  success: boolean;
  message: string;
  data?: T;
  [key: string]: any;
}

/**
 * Safely extracts a user-friendly error message from various error formats
 * (AxiosError, API error envelopes, network errors, strings, etc.)
 */
export const getApiErrorMessage = (
  error: unknown,
  fallbackMessage = "An unexpected error occurred. Please try again."
): string => {
  if (!error) return fallbackMessage;

  // If the error itself is already a string
  if (typeof error === "string") {
    return error.trim() || fallbackMessage;
  }

  if (typeof error === "object") {
    const err = error as any;

    // Axios response data or custom attached data
    const resData: ApiErrorData | undefined = err.response?.data || err.data;

    if (resData) {
      if (typeof resData === "string" && (resData as string).trim()) {
        return resData;
      }

      // Check standard backend error envelope: { success: false, message: "OTP Expired" }
      if (typeof resData.message === "string" && resData.message.trim()) {
        return resData.message;
      }

      // Alternative error keys: { error: "..." }
      if (typeof resData.error === "string" && resData.error.trim()) {
        return resData.error;
      }

      // Validation errors array: { errors: [...] }
      if (Array.isArray(resData.errors) && resData.errors.length > 0) {
        const firstError = resData.errors[0];
        if (typeof firstError === "string" && firstError.trim()) {
          return firstError;
        }
        if (typeof firstError === "object" && firstError !== null) {
          if (typeof firstError.msg === "string" && firstError.msg.trim()) {
            return firstError.msg;
          }
          if (typeof firstError.message === "string" && firstError.message.trim()) {
            return firstError.message;
          }
        }
      }
    }

    // Direct error properties (e.g. new Error("..."))
    if (
      typeof err.message === "string" &&
      err.message.trim() &&
      !err.message.startsWith("Request failed with status")
    ) {
      return err.message;
    }
  }

  return fallbackMessage;
};

/**
 * Shows an error toast using Sonner with the extracted API error message
 */
export const showApiErrorToast = (
  error: unknown,
  fallbackMessage?: string
): string => {
  const message = getApiErrorMessage(error, fallbackMessage);
  toast.error(message);
  return message;
};

/**
 * Shows a success toast using Sonner
 */
export const showApiSuccessToast = (message: string): void => {
  toast.success(message);
};

/**
 * Handles an API response object, displaying a success or error toast accordingly
 */
export const handleApiResponse = <T = any>(
  response: ApiResponsePayload<T>,
  options?: {
    showSuccessToast?: boolean;
    successMessage?: string;
    onSuccess?: (data?: T) => void;
    onError?: (message: string) => void;
  }
): boolean => {
  if (response.success) {
    if (options?.showSuccessToast !== false) {
      toast.success(options?.successMessage || response.message || "Action completed successfully");
    }
    options?.onSuccess?.(response.data);
    return true;
  } else {
    toast.error(response.message || "Operation failed");
    options?.onError?.(response.message);
    return false;
  }
};
