import { ReactNode } from "react";
import { DashboardHeader } from "@/components/common/dashboard-header";
import { PushNotificationHandler } from "@/features/notification";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full min-h-screen relative flex flex-col overflow-hidden bg-gradient-to-b from-[#034593] to-[#01152D]">
      {/* Background Push Notification Handler */}
      <PushNotificationHandler />

      {/* Abstract Blur Blobs for background */}

      <div className="absolute -top-[189px] left-[calc(50%-451px/2-738px)] w-[451px] h-[492px] bg-[#2186FF] opacity-45 blur-[203px] rounded-full pointer-events-none" />
      <div className="absolute -top-[56px] right-[27px] w-[451px] h-[492px] bg-[#2186FF] opacity-45 blur-[203px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-[167px] right-[-206px] w-[451px] h-[492px] bg-[#2186FF] opacity-45 blur-[203px] rounded-full pointer-events-none" />

      {/* Header */}
      <DashboardHeader />

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
