// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here and other Firebase libraries are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging-compat.js");

// Initialize the Firebase app in the service worker with the project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEmebWOU6MzDgT3emabDg2dxP8SoszpAI",
  authDomain: "watership-5e50f.firebaseapp.com",
  projectId: "watership-5e50f",
  storageBucket: "watership-5e50f.firebasestorage.app",
  messagingSenderId: "328061710532",
  appId: "1:328061710532:web:2106281cfa1e634eaf1991",
};

firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message: ", payload);

  const notificationTitle = payload.notification?.title || "Watership Notification";
  const notificationOptions = {
    body: payload.notification?.body || "You have received a new update.",
    icon: payload.notification?.icon || "/fav.jpg",
    badge: "/fav.jpg",
    data: {
      url: payload.data?.url || payload.fcmOptions?.link || "/dashboard/notifications",
      ...payload.data,
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/dashboard/notifications";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      // Focus existing tab if open
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.focus();
          if ("navigate" in client && targetUrl) {
            client.navigate(targetUrl);
          }
          return;
        }
      }
      // If no tab is open, open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
