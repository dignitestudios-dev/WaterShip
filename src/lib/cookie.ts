import { useProgressStore } from "@/features/questionnaire/store/progress.store";

export const getCookie = (name: string) => {
  if (typeof window === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
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
};

export const clearAuthSession = () => {
  removeCookie("token");
  if (typeof window !== "undefined") {
    try {
      useProgressStore.getState().reset();
      localStorage.removeItem("questionnaire-progress-storage");
    } catch (e) {
      // ignore
    }
  }
};
