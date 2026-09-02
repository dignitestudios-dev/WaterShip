"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, CalendarDays, Clock, Timer, User, Link as LinkIcon, MapPin, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useOnboardingProgress } from "@/features/onboarding/api/onboarding.queries";

// Helper to format Date string (e.g. 2026-08-27T00:00:00.000Z -> 27 August 2026)
const formatBookingDate = (dateStr?: string): string => {
  if (!dateStr) return "Scheduled Date";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

// Helper to format HH:mm to 12-hour AM/PM
const formatTimeDisplay = (timeStr?: string): string => {
  if (!timeStr) return "";
  if (timeStr.includes("AM") || timeStr.includes("PM")) return timeStr;
  const [hStr, mStr] = timeStr.split(":");
  let hour = parseInt(hStr, 10);
  const minute = mStr || "00";
  if (isNaN(hour)) return timeStr;
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  hour = hour === 0 ? 12 : hour;
  const hourFormatted = hour < 10 ? `0${hour}` : `${hour}`;
  return `${hourFormatted}:${minute} ${ampm}`;
};

// Helper to format time slot string (e.g. 17:30 - 18:00 -> 05:30 PM - 06:00 PM)
const formatTimeSlot = (timeSlot?: string, startTime?: string, endTime?: string): string => {
  if (timeSlot && timeSlot.includes("-")) {
    const parts = timeSlot.split("-").map((p) => p.trim());
    if (parts.length === 2) {
      return `${formatTimeDisplay(parts[0])} - ${formatTimeDisplay(parts[1])}`;
    }
  }
  if (startTime && endTime) {
    return `${formatTimeDisplay(startTime)} - ${formatTimeDisplay(endTime)}`;
  }
  if (startTime) {
    return formatTimeDisplay(startTime);
  }
  return "Scheduled Time";
};

export default function AppointmentDetailsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: progressResponse, isLoading } = useOnboardingProgress();
  const rawData: any = progressResponse?.data;
  const onboardingData = rawData?.onboarding || rawData;
  const appointmentBooking = onboardingData?.appointmentBooking || onboardingData?.booking;

  if (!mounted) return null;

  const displayDate = formatBookingDate(appointmentBooking?.bookingDate);
  const displayTime = formatTimeSlot(
    appointmentBooking?.timeSlot,
    appointmentBooking?.startTime,
    appointmentBooking?.endTime
  );
  const displayDuration = appointmentBooking?.duration || "30 mins";
  const displayLocation =
    appointmentBooking?.meetingLocation ||
    (appointmentBooking?.isTeamsMeetingRequested
      ? "Microsoft Teams Meeting"
      : "Sarasota Office");

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen relative overflow-hidden bg-gradient-to-b from-[#034593] to-[#01152D] pb-20">
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
              {[1, 2, 3, 4].map((step) => (
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

      {isLoading ? (
        <div className="w-[513px] max-w-[90%] h-[160px] mt-[40px] rounded-[17px] bg-white/10 flex items-center justify-center z-10">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      ) : (
        <>
          {/* Main Details Card */}
          <div className="w-[513px] max-w-[90%] min-h-[141px] py-[18px] mt-[40px] rounded-[17px] bg-gradient-to-br from-[#2186FF] to-[rgba(33,134,255,0.15)] flex flex-col justify-center px-[30px] z-10 relative shadow-lg">
            <div className="flex flex-col gap-[15px]">
              {/* Row 1: Date */}
              <div className="flex items-center gap-[10px]">
                <CalendarDays className="w-[16px] h-[16px] text-[#E0E0E0] shrink-0" />
                <span className="font-medium text-[14px] leading-[21px] tracking-[-0.01em] text-[#E0E0E0]">
                  {displayDate}
                </span>
              </div>

              {/* Row 2: Time */}
              <div className="flex items-center gap-[10px]">
                <Clock className="w-[16px] h-[16px] text-[#E0E0E0] shrink-0" />
                <span className="font-medium text-[14px] leading-[21px] tracking-[-0.01em] text-[#E0E0E0]">
                  {displayTime}
                </span>
              </div>

              {/* Row 3: Duration */}
              <div className="flex items-center gap-[10px]">
                <Timer className="w-[16px] h-[16px] text-[#E0E0E0] shrink-0" />
                <span className="font-medium text-[14px] leading-[21px] tracking-[-0.01em] text-[#E0E0E0]">
                  {displayDuration}
                </span>
              </div>

              {/* Row 4: Location */}
              <div className="flex items-center gap-[10px]">
                {appointmentBooking?.isTeamsMeetingRequested ? (
                  <User className="w-[16px] h-[16px] text-[#E0E0E0] shrink-0" />
                ) : (
                  <MapPin className="w-[16px] h-[16px] text-[#E0E0E0] shrink-0" />
                )}
                <span className="font-medium text-[14px] leading-[21px] tracking-[-0.01em] text-[#E0E0E0]">
                  {displayLocation}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Sub Info Card */}
          <div className="w-[513px] max-w-[90%] min-h-[80px] py-[16px] mt-[20px] rounded-[17px] bg-white/15 flex flex-col justify-center px-[30px] gap-[8px] z-10 shadow-sm">
            <div className="flex items-center gap-[10px]">
              <LinkIcon className="w-[14px] h-[14px] text-white shrink-0" />
              <span className="font-medium text-[14px] leading-[21px] tracking-[-0.01em] text-white">
                {appointmentBooking?.isTeamsMeetingRequested
                  ? "Microsoft Teams link will be emailed"
                  : "Confirmation details will be emailed"}
              </span>
            </div>
            <p className="font-medium text-[12px] leading-[18px] tracking-[-0.01em] text-[#E0E0E0] pl-[24px]">
              Please be available 5 minutes before your scheduled time.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
