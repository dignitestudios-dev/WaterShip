import { getMessaging, getToken, onMessage, isSupported, Messaging, MessagePayload } from "firebase/messaging";
import { app, vapidKey } from "./config";

/**
 * Returns the Firebase Messaging instance if supported in the current environment (browser only).
 */
export const getMessagingInstance = async (): Promise<Messaging | null> => {
  if (typeof window === "undefined") return null;
  try {
    const supported = await isSupported().catch(() => false);
    if (!supported) {
      console.warn("[FCM] Firebase Messaging is not supported in this browser environment.");
      return null;
    }
    return getMessaging(app);
  } catch (error) {
    console.error("[FCM] Error initializing messaging:", error);
    return null;
  }
};

/**
 * Helper to purge stale/corrupted Firebase IndexedDB databases
 * that trigger VersionError ("The requested version (1) is less than the existing version (2)").
 */
const clearFirebaseIndexedDb = async (): Promise<void> => {
  if (typeof window === "undefined" || !("indexedDB" in window)) return;
  const knownDbs = [
    "firebase-installations-database",
    "firebase-messaging-database",
    "fcm_token_object_Store",
  ];

  try {
    if ("databases" in indexedDB && typeof indexedDB.databases === "function") {
      const dbs = await indexedDB.databases();
      for (const db of dbs) {
        if (db.name && (db.name.includes("firebase") || db.name.includes("fcm"))) {
          indexedDB.deleteDatabase(db.name);
        }
      }
    }
  } catch {
    // Fallback if databases() is not permitted or fails
  }

  for (const dbName of knownDbs) {
    try {
      indexedDB.deleteDatabase(dbName);
    } catch {
      // Ignore
    }
  }
};

/**
 * Requests browser notification permission, registers the service worker,
 * and fetches the FCM client token.
 */
export const requestFcmToken = async (): Promise<string | null> => {
  if (typeof window === "undefined" || !("Notification" in window)) {
    console.warn("[FCM] Notifications are not supported in this browser.");
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("[FCM] Notification permission was not granted:", permission);
      return null;
    }

    const messaging = await getMessagingInstance();
    if (!messaging) return null;

    let serviceWorkerRegistration: ServiceWorkerRegistration | undefined;
    if ("serviceWorker" in navigator) {
      serviceWorkerRegistration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      await navigator.serviceWorker.ready;
    }

    try {
      const token = await getToken(messaging, {
        vapidKey: vapidKey || undefined,
        serviceWorkerRegistration,
      });

      return token || null;
    } catch (innerError: unknown) {
      const errMsg = innerError instanceof Error ? innerError.message : String(innerError);
      // Handle IndexedDB VersionError conflict between SDK versions or cached databases
      if (errMsg.includes("VersionError") || errMsg.includes("less than the existing version")) {
        console.warn("[FCM] Detected IndexedDB VersionError conflict. Purging stale databases and retrying...");
        await clearFirebaseIndexedDb();
        const retryToken = await getToken(messaging, {
          vapidKey: vapidKey || undefined,
          serviceWorkerRegistration,
        });
        return retryToken || null;
      }
      throw innerError;
    }
  } catch (error) {
    console.error("[FCM] Error retrieving FCM token:", error);
    return null;
  }
};

/**
 * Subscribes to foreground push notification messages.
 */
export const onMessageListener = (callback: (payload: MessagePayload) => void): (() => void) => {
  let unsubscribe: (() => void) | null = null;
  let isMounted = true;

  getMessagingInstance().then((messaging) => {
    if (messaging && isMounted) {
      unsubscribe = onMessage(messaging, (payload) => {
        callback(payload);
      });
    }
  });

  return () => {
    isMounted = false;
    if (unsubscribe) {
      unsubscribe();
    }
  };
};

export type { MessagePayload };
