"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie, setCookie } from "@/lib/cookie";
import { useGetMe } from "@/features/users/api/users.queries";
import { CompleteProfileForm } from "@/features/auth";

export default function CompleteProfilePage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    const curToken = getCookie("token");
    setToken(curToken);
  }, []);

  const { data: getMeResponse, isLoading } = useGetMe({ enabled: !!token });

  useEffect(() => {
    if (!isClient) return;

    const currentToken = getCookie("token");
    if (!currentToken) {
      router.replace("/login");
      return;
    }

    const cookieCompleted = getCookie("isProfileCompleted");
    if (cookieCompleted === "true") {
      router.replace("/dashboard");
      return;
    }

    if (!isLoading && getMeResponse?.data) {
      const isCompleted = !!getMeResponse.data.isProfileCompleted;
      setCookie("isProfileCompleted", String(isCompleted));

      if (isCompleted) {
        router.replace("/dashboard");
      }
    }
  }, [isClient, getMeResponse, isLoading, router]);

  if (!isClient) {
    return null;
  }

  const currentToken = getCookie("token");
  if (!currentToken) {
    return null;
  }

  return <CompleteProfileForm />;
}
