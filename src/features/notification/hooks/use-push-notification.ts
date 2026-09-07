"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { requestFcmToken, onMessageListener, MessagePayload } from "@/firebase/messaging";
import { useUpdateFcm } from "@/features/auth/api/auth.mutations";
import { getCookie } from "@/lib/cookie";
import { useQueryClient } from "@tanstack/react-query";
import { NOTIFICATION_QUERY_KEYS } from "../api/notification.queries";

const FCM_TOKEN_STORAGE_KEY = "watership_fcm_token";

export const usePushNotification = () => {
  const router = useRouter();
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const updateFcmMutation = useUpdateFcm();

  // Check initial permission state and cached token
  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPermission("unsupported");
      return;
    }

    setPermission(Notification.permission);
    const cachedToken = localStorage.getItem(FCM_TOKEN_STORAGE_KEY);
    if (cachedToken) {
      setFcmToken(cachedToken);
    }
  }, []);

  // Sync token with backend if permission is granted and user is authenticated
  const syncToken = useCallback(
    async (force = false) => {
      if (typeof window === "undefined" || !("Notification" in window)) return;
      if (Notification.permission !== "granted") return;

      const authToken = getCookie("token");
      if (!authToken) return;

      try {
        const cachedToken = localStorage.getItem(FCM_TOKEN_STORAGE_KEY);
        const token = await requestFcmToken();

        if (token) {
          setFcmToken(token);
          if (force || cachedToken !== token) {
            await updateFcmMutation.mutateAsync({ fcmToken: token });
            localStorage.setItem(FCM_TOKEN_STORAGE_KEY, token);
          }
        }
      } catch (error) {
        console.error("[PushNotification] Error syncing token:", error);
      }
    },
    [updateFcmMutation]
  );

  // Request permission, get token, and update server
  const enableNotifications = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      toast.error("Push notifications are not supported in your browser.");
      return false;
    }

    if (Notification.permission === "denied") {
      toast.error(
        "Notification permission is blocked. Please allow notifications in your browser site settings."
      );
      setPermission("denied");
      return false;
    }

    setIsLoading(true);
    try {
      const token = await requestFcmToken();
      const currentPermission = Notification.permission as NotificationPermission;
      setPermission(currentPermission);

      if (token && currentPermission === "granted") {
        setFcmToken(token);
        await updateFcmMutation.mutateAsync({ fcmToken: token });
        localStorage.setItem(FCM_TOKEN_STORAGE_KEY, token);
        toast.success("Notifications enabled successfully!");
        return true;
      } else if (currentPermission === "denied") {
        toast.error("Notification permission was denied.");
        return false;
      }
      return false;
    } catch (error) {
      console.error("[PushNotification] Error enabling notifications:", error);
      toast.error("Failed to enable notifications. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [updateFcmMutation]);

  const queryClient = useQueryClient();

  // Foreground listener for push notifications
  useEffect(() => {
    if (typeof window === "undefined") return;

    const unsubscribe = onMessageListener((payload: MessagePayload) => {
      console.log("[PushNotification] Foreground message received:", payload);

      // Invalidate query caches so unread badge and notification lists update live
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all });

      const title = payload.notification?.title || "New Notification";
      const body = payload.notification?.body || "You have received a new update.";
      const link = payload.data?.url || payload.fcmOptions?.link || "/dashboard/notifications";

      toast.info(title, {
        description: body,
        action: {
          label: "View",
          onClick: () => router.push(link),
        },
      });
    });

    return () => {
      unsubscribe();
    };
  }, [router, queryClient]);

  return {
    permission,
    fcmToken,
    isLoading: isLoading || updateFcmMutation.isPending,
    isSupported: permission !== "unsupported",
    isSubscribed: permission === "granted" && !!fcmToken,
    enableNotifications,
    syncToken,
  };
};
