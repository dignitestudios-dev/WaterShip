"use client";

import { useEffect } from "react";
import { usePushNotification } from "../hooks/use-push-notification";

import { syncFcmToken } from "../lib/sync-fcm";

/**
 * Headless client component that mounts push notification foreground listeners
 * and synchronizes the FCM token for authenticated sessions.
 */
export const PushNotificationHandler = () => {
  // Sets up foreground message listeners
  usePushNotification();

  useEffect(() => {
    // If user has allowed notification permission, keep token updated with backend
    syncFcmToken(false);
  }, []);

  return null;
};

