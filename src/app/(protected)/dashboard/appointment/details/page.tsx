"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, CalendarDays, Clock, Timer, User, Link as LinkIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function AppointmentDetailsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen relative overflow-hidden bg-gradient-to-b from-[#034593] to-[#01152D] ">
      
      {/* Background Vectors */}
      <div className="absolute left-[calc(50%-451.09px/2-738.45px)] top-[-189px] w-[451.09px] h-[492px] bg-[#2186FF] opacity-45 blur-[203.65px] pointer-events-none" />
      <div className="absolute right-[-206.09px] bottom-[-167px] w-[451.09px] h-[492px] bg-[#2186FF] opacity-45 blur-[203.65px] pointer-events-none" />

      {/* Back Button */}
      <div 
        className="absolute left-[50px] top-[150px] md:top-[126px] w-[30px] h-[30px] rounded-full bg-white/15 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors z-10" 
        onClick={() => router.push("/dashboard")}
      >
        <ChevronLeft className="w-[18px] h-[18px] text-white" strokeWidth={2} />
      </div>

      <div className="flex flex-col items-center w-full max-w-[799px] z-10 gap-[30px] mt-[100px] md:mt-[166px]">
        {/* Header */}
        <div className="flex flex-col items-center gap-[25px] w-full text-center px-4">
          <h1 className="font-semibold text-[32px] md:text-[40px] leading-[1.2] tracking-[-0.025em] text-white">
            Appointment Details
          </h1>
          <p className="font-normal text-[16px] leading-[140%] text-[#E0E0E0] max-w-[470px]">
            Here are the details of your scheduled appointment.
          </p>

          {/* Progress Bar Area */}
          <div className="w-[513px] max-w-full flex flex-col gap-[10px] mt-[15px]">
            {/* Progress Lines */}
            <div className="flex justify-between items-center gap-[8px] w-full">
              {[1, 2, 3, 4].map(step => (
                <div key={step} className="flex-1 border-[2px] rounded-full border-white" />
              ))}
            </div>
            
            {/* Progress Text */}
            <div className="flex justify-between items-center w-full">
              <span className="text-[#DDEBF8] font-medium text-[14px] leading-[21px] tracking-[-0.01em]">
                Step 4 of 4 Completed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Details Card */}
      <div className="w-[513px] max-w-[90%] h-[141px] mt-[40px] rounded-[17px] bg-gradient-to-br from-[#2186FF] to-[rgba(33,134,255,0.15)] flex flex-col justify-center px-[30px] z-10 relative">
        <div className="flex flex-col gap-[15px]">
          {/* Row 1 */}
          <div className="flex items-center gap-[10px]">
            <CalendarDays className="w-[14px] h-[14px] text-[#E0E0E0]" />
            <span className="font-medium text-[14px] leading-[21px] tracking-[-0.01em] text-[#E0E0E0]">
              02 May 2026
            </span>
          </div>

          {/* Row 2 */}
          <div className="flex items-center gap-[10px]">
            <Clock className="w-[14px] h-[14px] text-[#E0E0E0]" />
            <span className="font-medium text-[14px] leading-[21px] tracking-[-0.01em] text-[#E0E0E0]">
              11:00 AM
            </span>
          </div>

          {/* Row 3 */}
          <div className="flex items-center gap-[10px]">
            <Timer className="w-[14px] h-[14px] text-[#E0E0E0]" />
            <span className="font-medium text-[14px] leading-[21px] tracking-[-0.01em] text-[#E0E0E0]">
              1 Hour
            </span>
          </div>

          {/* Row 4 */}
          <div className="flex items-center gap-[10px]">
            <User className="w-[14px] h-[14px] text-[#E0E0E0]" />
            <span className="font-medium text-[14px] leading-[21px] tracking-[-0.01em] text-[#E0E0E0]">
              Adam(Advisor)
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Sub Info Card */}
      <div className="w-[513px] max-w-[90%] h-[80px] mt-[20px] rounded-[17px] bg-white/15 flex flex-col justify-center px-[30px] gap-[8px] z-10">
        <div className="flex items-center gap-[10px]">
          <LinkIcon className="w-[14px] h-[14px] text-white" />
          <span className="font-medium text-[14px] leading-[21px] tracking-[-0.01em] text-white">
            Link will be emailed
          </span>
        </div>
        <p className="font-medium text-[12px] leading-[18px] tracking-[-0.01em] text-[#E0E0E0] pl-[24px]">
          Please be available 5 minutes before your scheduled time.
        </p>
      </div>

    </div>
  );
}
