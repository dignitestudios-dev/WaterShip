import { useProgressStore } from "@/features/questionnaire/store/progress.store";
import { queryClient } from "@/lib/query-client";

export const getCookie = (name: string): string | null => {
  if (typeof window === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
  return null;
};

export const setCookie = (name: string, value: string, days = 7) => {
  if (typeof window === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `; expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}${expires}; path=/`;
};

export const removeCookie = (name: string) => {
  if (typeof window === "undefined") return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};

export const clearAllCookies = () => {
  if (typeof window === "undefined") return;
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
    if (name) {
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    }
  }
};

export const clearAuthSession = () => {
  // 1. Clear Cookies
  removeCookie("token");
  removeCookie("isProfileCompleted");
  clearAllCookies();

  if (typeof window !== "undefined") {
    // 2. Clear TanStack Query Cache
    try {
      queryClient.clear();
      queryClient.resetQueries();
    } catch (e) {
      // ignore
    }

    // 3. Reset Zustand Stores
    try {
      useProgressStore.getState().reset();
    } catch (e) {
      // ignore
    }

    // 4. Clear LocalStorage and SessionStorage completely
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      // ignore
    }
  }
};

