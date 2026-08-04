"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, FileText } from "lucide-react";

export default function NotificationsPage() {
  const router = useRouter();

  const notifications = [
    {
      title: "Updating Status",
      subtitle: "We are currently processing your risk assessment status.",
      time: "Just Now"
    },
    {
      title: "Risk Assessment Submitted",
      subtitle: "Your risk assessment has been successfully submitted.",
      time: "2 Hour ago"
    },
    {
      title: "Questionnaire Completed",
      subtitle: "Your questionnaire has been successfully submitted.",
      time: "Today, 9:12 AM"
    },
    {
      title: "Secure Redirect Completed",
      subtitle: "You have successfully completed the secure process.",
      time: "Yesterday"
    },
    {
      title: "Risk Assessment",
      subtitle: "Start Your Risk Assessment Now!",
      time: "Wednesday"
    },
    {
      title: "Questionnaire Completed",
      subtitle: "Your questionnaire has been successfully submitted.",
      time: "Today, 9:12 AM"
    },
    {
      title: "Secure Redirect Completed",
      subtitle: "You have successfully completed the secure process.",
      time: "Yesterday"
    }
  ];

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen relative overflow-hidden bg-gradient-to-b from-[#034593] to-[#01152D]">
      
      {/* Background Vectors */}
      <div className="absolute left-[calc(50%-451.09px/2-738.45px)] top-[-189px] w-[451.09px] h-[492px] bg-[#2186FF] opacity-45 blur-[203.65px] pointer-events-none" />
      <div className="absolute right-[-206.09px] bottom-[-167px] w-[451.09px] h-[492px] bg-[#2186FF] opacity-45 blur-[203.65px] pointer-events-none" />

      {/* Content Container */}
      <div className="flex flex-col w-full max-w-[1440px] px-[50px] mt-[40px] z-10 relative pb-[100px]">
        
        {/* Back Button */}
        <div 
          className="w-[30px] h-[30px] rounded-full bg-white/15 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors mb-[20px]" 
          onClick={() => router.back()}
        >
          <ChevronLeft className="w-[18px] h-[18px] text-white" strokeWidth={2} />
        </div>

        <div className="flex flex-col items-center gap-[25px] w-full mt-[10px]">
          {/* Header */}
          <div className="flex flex-col items-center gap-[10px] text-center max-w-[799px]">
            <h1 className="font-semibold text-[40px] leading-[60px] tracking-[-0.025em] text-white">
              Notification
            </h1>
            <p className="font-normal text-[16px] leading-[140%] text-[#E0E0E0]">
              Help us understand your financial situation, goals, and preferences. This will only take a few minutes.
            </p>
          </div>

          {/* Notifications List */}
          <div className="flex flex-col gap-[10px] w-full max-w-[1340px] mt-[20px]">
            {notifications.map((notif, i) => (
              <div 
                key={i} 
                className="w-full min-h-[80px] bg-white/15 border-[0.5px] border-[#727272]/15 rounded-[17px] flex items-center justify-between px-[30px] py-[23px] transition-colors hover:bg-white/20 cursor-pointer"
              >
                
                <div className="flex items-center gap-[20px]">
                  {/* Icon */}
                  <div className="w-[34px] h-[34px] rounded-[9.71px] bg-gradient-to-br from-[#2186FF] to-[rgba(33,134,255,0.15)] flex items-center justify-center shrink-0">
                    <FileText className="w-[14px] h-[16px] text-white" fill="white" />
                  </div>
                  
                  {/* Texts */}
                  <div className="flex flex-col gap-[4px]">
                    <h3 className="font-semibold text-[14px] leading-[21px] tracking-[-0.01em] text-white">
                      {notif.title}
                    </h3>
                    <p className="font-medium text-[12px] leading-[18px] tracking-[-0.01em] text-[#E0E0E0]">
                      {notif.subtitle}
                    </p>
                  </div>
                </div>

                {/* Time */}
                <span className="font-medium text-[10px] leading-[15px] tracking-[-0.01em] text-[#E0E0E0] shrink-0 text-right">
                  {notif.time}
                </span>

              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
