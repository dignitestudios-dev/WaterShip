"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie, setCookie } from "@/lib/cookie";
import { useGetMe } from "@/features/users/api/users.queries";
import { Loader2 } from "lucide-react";

export function ProtectedGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    setToken(getCookie("token"));
  }, []);

  const { data: getMeResponse, isLoading, isError } = useGetMe({ enabled: !!token });

  useEffect(() => {
    if (!isClient) return;

    const currentToken = getCookie("token");
    if (!currentToken) {
      router.replace("/login");
      return;
    }

    const cookieCompleted = getCookie("isProfileCompleted");
    if (cookieCompleted === "false") {
      router.replace("/complete-profile");
      return;
    }

    if (!isLoading && getMeResponse?.data) {
      const isCompleted = !!getMeResponse.data.isProfileCompleted;

      // Prevent stale cache from rolling back a completed profile
      if (!isCompleted && cookieCompleted === "true") {
        return;
      }

      setCookie("isProfileCompleted", String(isCompleted));

      if (!isCompleted) {
        router.replace("/complete-profile");
      }
    }
  }, [isClient, getMeResponse, isLoading, isError, router]);

  if (!isClient) {
    return null;
  }

  const currentToken = getCookie("token");
  if (!currentToken) {
    return null;
  }

  const cookieCompleted = getCookie("isProfileCompleted");
  if (cookieCompleted === "false") {
    return null;
  }

  // If we don't have confirmation yet and it's loading the user
  if (isLoading && cookieCompleted !== "true") {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-white animate-spin" />
      </div>
    );
  }

  // If user profile is not completed according to getMe response and cookie isn't true
  if (getMeResponse?.data && !getMeResponse.data.isProfileCompleted && cookieCompleted !== "true") {
    return null;
  }

  return <>{children}</>;
}
