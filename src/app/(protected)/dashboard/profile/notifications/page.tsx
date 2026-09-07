"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Bell, AlertCircle, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { usePushNotification } from "@/features/notification";
import { useSettings, useUpdateSettings } from "@/features/settings";

export default function NotificationPreferencesPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { data: settingsResponse, isLoading: isSettingsLoading } = useSettings();
  const updateSettingsMutation = useUpdateSettings();
  const { permission, isLoading: isPushLoading, enableNotifications } = usePushNotification();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isNotificationEnabled = settingsResponse?.data?.isNotificationEnabled ?? false;
  const isUpdating = updateSettingsMutation.isPending || isPushLoading;

  const handleToggle = async (checked: boolean) => {
    // 1. Call backend API to update notification preferences (PATCH /settings)
    updateSettingsMutation.mutate({
      isNotificationEnabled: checked,
    });

    // 2. If enabling, also trigger browser permission & FCM token sync to /auth/update-fcm
    if (checked) {
      await enableNotifications();
    }
  };


  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen relative overflow-hidden bg-gradient-to-b from-[#034593] to-[#01152D] pt-[80px]">
      
      {/* Background Vectors */}
      <div className="absolute left-[calc(50%-451.09px/2-738.45px)] top-[-189px] w-[451.09px] h-[492px] bg-[#2186FF] opacity-45 blur-[203.65px] pointer-events-none" />
      <div className="absolute right-[-206.09px] bottom-[-167px] w-[451.09px] h-[492px] bg-[#2186FF] opacity-45 blur-[203.65px] pointer-events-none" />

      {/* Back Button */}
      <div 
        className="absolute left-[50px] top-[150px] md:top-[126px] w-[30px] h-[30px] rounded-full bg-white/15 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors z-10" 
        onClick={() => router.push("/dashboard/profile")}
      >
        <ChevronLeft className="w-[18px] h-[18px] text-white" strokeWidth={2} />
      </div>

      <div className="flex flex-col pb-20 items-center w-full max-w-[563px] z-10 mt-10 gap-[30px] px-[20px]">
        {/* Header Section */}
        <div className="flex flex-col items-center gap-[25px] text-center max-w-[470px]">
          <h1 className="font-semibold text-[32px] md:text-[40px] leading-[1.2] md:leading-[60px] tracking-[-0.025em] text-white">
            Notification Preferences
          </h1>
          <p className="font-normal text-[16px] leading-[140%] text-[#E0E0E0]">
            Manage your push notification preferences and alerts to stay updated on your account and activities.
          </p>
        </div>

        {/* Toggles List Area */}
        <div className="flex flex-col w-full gap-[20px] mt-[20px]">
          <div className="flex flex-col w-full gap-[20px]">
            {/* List Item */}
            <div className="flex items-center justify-between w-full relative min-h-[81px] bg-white/10 p-5 rounded-2xl border border-white/10">
              
              {/* Text Content */}
              <div className="flex flex-col gap-[6px] w-[calc(100%-70px)]">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#2186FF]" />
                  <h3 className="font-medium text-[15px] leading-[21px] text-white">
                    Enable Push Notifications
                  </h3>
                </div>
                <p className="font-normal text-[12px] leading-[18px] text-[#E0E0E0]">
                  Receive real-time alerts about account updates, questionnaire statuses, and important announcements.
                </p>

                
              </div>
              
              {/* Toggle Switch */}
              <div className="flex items-center justify-center">
                <Switch 
                  checked={isNotificationEnabled}
                  disabled={isSettingsLoading || isUpdating}
                  onCheckedChange={handleToggle}
                  className="w-[42px] h-[24px] data-checked:bg-[#2186FF] data-unchecked:bg-white/16 border-none [&>span]:bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


