import { VerifyEmailForm } from "@/features/auth";
import { Suspense } from "react";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="w-full min-h-screen flex items-center justify-center bg-transparent" />}>
      <VerifyEmailForm />
    </Suspense>
  );
}

