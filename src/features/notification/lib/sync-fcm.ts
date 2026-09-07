import { requestFcmToken } from "@/firebase/messaging";
import { updateFcm } from "@/features/auth/api/auth.api";
import { getCookie } from "@/lib/cookie";

const FCM_TOKEN_STORAGE_KEY = "watership_fcm_token";

/**
 * Retrieves the FCM token and sends it to the backend API via POST /auth/update-fcm.
 * Called automatically after login and inside the protected dashboard layout.
 */
export const syncFcmToken = async (promptUser = true): Promise<string | null> => {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return null;
  }

  // If user previously blocked notifications, skip
  if (Notification.permission === "denied") {
    return null;
  }

  // If permission is default and promptUser is false, skip
  if (Notification.permission === "default" && !promptUser) {
    return null;
  }

  // Ensure user has an active auth session
  const authToken = getCookie("token");
  if (!authToken) {
    return null;
  }

  try {
    const token = await requestFcmToken();
    if (token) {
      const cachedToken = localStorage.getItem(FCM_TOKEN_STORAGE_KEY);
      if (cachedToken !== token) {
        await updateFcm({ fcmToken: token });
        localStorage.setItem(FCM_TOKEN_STORAGE_KEY, token);
        console.log("[FCM] Successfully synced FCM token with backend API (/auth/update-fcm)");
      }
      return token;
    }
  } catch (error) {
    console.error("[FCM] Error syncing FCM token with backend:", error);
  }

  return null;
};
