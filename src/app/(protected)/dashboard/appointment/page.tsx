"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Lock, ChevronDown, MonitorPlay, Check, Loader2 } from "lucide-react";
import { useProgressStore } from "@/features/questionnaire/store/progress.store";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  useOnboardingProgress,
  useAppointmentSlotsByDate,
  useBookAppointment,
} from "@/features/onboarding/api/onboarding.queries";
import { AppointmentSlot } from "@/features/onboarding/types/onboarding.types";

const DEFAULT_LOCATIONS = [
  "Sarasota Office",
  "Lakewood Ranch Office",
  "Client's Home / Address",
  "Custom Address",
];

const DAYS_OF_WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Helper to format Date to YYYY-MM-DD
const formatToISODate = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
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

export default function AppointmentPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [startDate, setStartDate] = useState(() => new Date());
  const [location, setLocation] = useState(DEFAULT_LOCATIONS[0]);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isTeamsRequested, setIsTeamsRequested] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<AppointmentSlot | null>(null);
  const [bookingState, setBookingState] = useState<"idle" | "booking" | "confirmed">("idle");

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: progressResponse } = useOnboardingProgress();
  const rawData: any = progressResponse?.data;
  const onboardingData = rawData?.onboarding || rawData;

  const uploadedDocuments = useProgressStore((state) => state.uploadedDocuments);
  const setAppointmentBooked = useProgressStore((state) => state.setAppointmentBooked);

  const isDocumentUploadCompleted =
    onboardingData?.documentUpload?.status === "completed" ||
    Object.keys(uploadedDocuments).length >= 4;
  const isLocked = !isDocumentUploadCompleted;

  // 8 visible days in calendar horizontal strip
  const visibleDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 8; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      days.push({
        fullDate: d,
        day: DAYS_OF_WEEK[d.getDay()],
        date: d.getDate().toString(),
        month: d.getMonth(),
        year: d.getFullYear(),
        isoDate: formatToISODate(d),
      });
    }
    return days;
  }, [startDate]);

  const [selectedDateObj, setSelectedDateObj] = useState(visibleDays[0]);

  // Query appointment slots by selected date (YYYY-MM-DD)
  const selectedDateISO = selectedDateObj?.isoDate || formatToISODate(selectedDateObj?.fullDate || new Date());
  const { data: slotsResponse, isLoading: isSlotsLoading } = useAppointmentSlotsByDate(selectedDateISO);
  const bookMutation = useBookAppointment();

  const slotsData = slotsResponse?.data;
  const availableSlots: AppointmentSlot[] = slotsData?.slots || [];

  // Locations from API or default fallback
  const locationOptions = useMemo(() => {
    if (slotsData?.locations && slotsData.locations.length > 0) {
      return slotsData.locations.map((loc) => loc.name);
    }
    return DEFAULT_LOCATIONS;
  }, [slotsData?.locations]);

  // Reset or select default slot when slots change
  useEffect(() => {
    if (availableSlots.length > 0) {
      const firstAvailable = availableSlots.find(
        (s) => s.status?.toLowerCase() === "available"
      );
      setSelectedSlot(firstAvailable || availableSlots[0]);
    } else {
      setSelectedSlot(null);
    }
  }, [selectedDateISO, availableSlots.length]);

  if (!mounted) {
    return <div className="w-full min-h-screen bg-gradient-to-b from-[#034593] to-[#01152D]" />;
  }

  const handlePrevWeek = () => {
    const newStart = new Date(startDate);
    newStart.setDate(newStart.getDate() - 7);
    setStartDate(newStart);
  };

  const handleNextWeek = () => {
    const newStart = new Date(startDate);
    newStart.setDate(newStart.getDate() + 7);
    setStartDate(newStart);
  };

  const handleBook = () => {
    if (!selectedSlot) {
      toast.error("Please select an available time slot");
      return;
    }

    if (selectedSlot.status?.toLowerCase() === "booked") {
      toast.error("This slot is already booked. Please choose another slot.");
      return;
    }

    setBookingState("booking");

    bookMutation.mutate(
      {
        slotId: selectedSlot._id,
        meetingLocation: isTeamsRequested ? "Microsoft Teams" : location,
        isTeamsMeetingRequested: isTeamsRequested,
      },
      {
        onSuccess: () => {
          setBookingState("confirmed");
          setAppointmentBooked(true);
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
        },
        onError: () => {
          setBookingState("idle");
        },
      }
    );
  };

  const formattedMonthYear = `${MONTHS[startDate.getMonth()]} ${startDate.getFullYear()}`;
  const formattedSelectedDate =
    `0${selectedDateObj.date}`.slice(-2) +
    ` ${MONTHS[selectedDateObj.month]} ${selectedDateObj.year}`;
  const displayTime = selectedSlot ? formatTimeDisplay(selectedSlot.startTime) : "None Selected";

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#034593] to-[#01152D] relative overflow-hidden flex flex-col items-center pb-20 pt-[80px]">
      {/* Background Blobs */}
      <div className="absolute -top-[189px] left-[calc(50%-451px/2-738px)] w-[451px] h-[492px] bg-[#2186FF] opacity-45 blur-[203px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-[105px] right-[-206px] w-[451px] h-[492px] bg-[#2186FF] opacity-45 blur-[203px] rounded-full pointer-events-none" />

      {/* Top Header / Progress */}
      <div className="w-[799px] max-w-full flex flex-col items-center mt-[50px] z-10 relative px-4">
        <button
          onClick={() => router.back()}
          className="absolute left-[0px] md:left-[-200px] top-[0px] w-[30px] h-[30px] rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition"
        >
          <ChevronLeft className="w-4 h-4 text-white" strokeWidth={3} />
        </button>

        {!isLocked && (
          <div className="flex flex-col items-center">
            <h1 className="text-white font-semibold text-[40px] leading-[60px] tracking-[-0.025em] text-center">
              Book Your Appointment
            </h1>
            <p className="text-[#E0E0E0] font-normal text-[16px] leading-[140%] text-center mt-[25px]">
              Select an available date and time slot with your advisor.
            </p>

            {/* Progress Bar Area */}
            <div className="w-[513px] max-w-full mt-[30px] flex flex-col gap-[10px]">
              {/* Progress Lines */}
              <div className="flex justify-between items-center gap-[8px] w-full">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={cn(
                      "flex-1 border-[2px] rounded-full",
                      step <= 3 ? "border-white" : "border-[#E0E0E0] opacity-45"
                    )}
                  />
                ))}
              </div>

              {/* Progress Text */}
              <div className="flex justify-between items-center w-full">
                <span className="text-[#DDEBF8] font-medium text-[14px] leading-[21px] tracking-[-0.01em]">
                  Step 3 of 4 Completed
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={isLocked ? "locked" : "active"}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full flex flex-col items-center justify-center z-10 px-4"
        >
          {isLocked ? (
            <div className="flex flex-col items-center justify-center mt-[100px]">
              <div className="w-[79.49px] h-[79.49px] bg-white/15 rounded-full flex items-center justify-center mb-[25px]">
                <Lock className="w-10 h-10 text-white" strokeWidth={2.5} />
              </div>
              <h1 className="text-white font-semibold text-[26px] leading-[39px] tracking-[-0.025em] text-center mb-[10px]">
                Finish Earlier Steps First
              </h1>
              <p className="text-[#E0E0E0] font-normal text-[14px] leading-[21px] text-center">
                This step will become available once you have uploaded all your documents.
              </p>
            </div>
          ) : (
            <div className="mt-[40px] w-full max-w-[510px] flex flex-col items-center pb-20">
              {/* Month Selector */}
              <div className="w-full flex justify-between items-center mb-[15px]">
                <span className="text-white font-semibold text-[18px] leading-[27px] tracking-[-0.01em]">
                  {formattedMonthYear}
                </span>
                <div className="flex gap-[15px]">
                  <ChevronLeft
                    className="w-[20px] h-[20px] text-white cursor-pointer hover:opacity-80 transition"
                    onClick={handlePrevWeek}
                  />
                  <ChevronLeft
                    className="w-[20px] h-[20px] text-white cursor-pointer rotate-180 hover:opacity-80 transition"
                    onClick={handleNextWeek}
                  />
                </div>
              </div>

              {/* Day Selector */}
              <div className="w-full flex justify-between items-center mb-[35px] gap-[8px]">
                {visibleDays.map((d, idx) => {
                  const isSelected = selectedDateObj.fullDate.getTime() === d.fullDate.getTime();
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedDateObj(d)}
                      className={cn(
                        "w-[58px] h-[77px] border rounded-[25px] flex flex-col items-center justify-center gap-[10px] cursor-pointer transition-all",
                        isSelected
                          ? "bg-gradient-to-br from-[#2186FF] to-[rgba(33,134,255,0.15)] border-[rgba(114,114,114,0.15)]"
                          : "bg-white/15 border-transparent hover:bg-white/20"
                      )}
                    >
                      <span
                        className={cn(
                          "font-medium text-[12px] leading-[18px] tracking-[-0.01em]",
                          isSelected ? "text-white" : "text-[#E0E0E0]"
                        )}
                      >
                        {d.day}
                      </span>
                      <span className="font-medium text-[16px] leading-[24px] text-center tracking-[-0.01em] text-white">
                        {d.date}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Select a meeting location */}
              <div className="w-full flex flex-col gap-[15px] mb-[30px] relative">
                <span className="text-white font-medium text-[14px] leading-[21px] tracking-[-0.01em]">
                  Select a meeting location
                </span>

                <div
                  onClick={() => setIsLocationOpen(!isLocationOpen)}
                  className="w-full h-[40px] bg-white/15 rounded-[7px] flex items-center justify-between px-[24px] cursor-pointer hover:bg-white/20 transition-colors"
                >
                  <span className="text-[#E0E0E0] font-normal text-[12px] leading-[18px]">
                    {location}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-[14px] h-[14px] text-[#E0E0E0] transition-transform",
                      isLocationOpen ? "rotate-180" : ""
                    )}
                  />
                </div>

                {isLocationOpen && (
                  <div className="absolute top-[85px] left-0 w-full bg-[#295482] rounded-[8px] overflow-hidden z-20 shadow-xl border border-white/10">
                    {locationOptions.map((loc, i) => (
                      <div
                        key={loc}
                        onClick={() => {
                          setLocation(loc);
                          setIsLocationOpen(false);
                        }}
                        className={cn(
                          "w-full h-[45px] flex items-center px-[24px] cursor-pointer hover:bg-white/10 transition-colors",
                          i !== 0 ? "border-t border-white/10" : ""
                        )}
                      >
                        <span className="text-white text-[13px] leading-[20px] font-normal">
                          {loc}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div
                  onClick={() => setIsTeamsRequested(!isTeamsRequested)}
                  className="flex items-center gap-[10px] mt-[5px] cursor-pointer group"
                >
                  <div
                    className={cn(
                      "w-[32px] h-[32px] rounded flex items-center justify-center transition-all",
                      isTeamsRequested
                        ? "bg-[#464EB8] ring-2 ring-white/50"
                        : "bg-[#464EB8]/70 group-hover:bg-[#464EB8]"
                    )}
                  >
                    <MonitorPlay className="w-[16px] h-[16px] text-white" />
                  </div>
                  <span
                    className={cn(
                      "font-medium text-[12px] leading-[18px] tracking-[-0.01em] underline transition-colors",
                      isTeamsRequested ? "text-white font-semibold" : "text-white/85 group-hover:text-white"
                    )}
                  >
                    {isTeamsRequested
                      ? "Microsoft Teams meeting link requested"
                      : "Unable to meet in person? Request a Microsoft Teams meeting link."}
                  </span>
                </div>
              </div>

              {/* AVAILABLE TIME SLOTS */}
              <div className="w-full flex flex-col gap-[15px] mb-[30px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#E0E0E0] font-medium text-[14px] leading-[21px] tracking-[-0.01em] uppercase">
                    Available Time Slot
                  </span>
                  {slotsData?.availableCount !== undefined && (
                    <span className="text-white/70 text-[12px]">
                      {slotsData.availableCount} of {slotsData.totalSlots || availableSlots.length} slots available
                    </span>
                  )}
                </div>

                {isSlotsLoading ? (
                  <div className="flex items-center justify-center py-6 w-full gap-2">
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                    <span className="text-white/80 text-sm">Loading available slots...</span>
                  </div>
                ) : availableSlots.length > 0 ? (
                  <div className="flex flex-wrap gap-[8px]">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedSlot?._id === slot._id;
                      const isAvailable = slot.status?.toLowerCase() === "available";

                      return (
                        <button
                          key={slot._id}
                          type="button"
                          disabled={!isAvailable}
                          onClick={() => isAvailable && setSelectedSlot(slot)}
                          className={cn(
                            "px-4 h-[40px] rounded-[100px] flex items-center justify-center transition-all text-center",
                            !isAvailable
                              ? "bg-white/5 opacity-40 cursor-not-allowed border border-white/5"
                              : isSelected
                              ? "bg-gradient-to-br from-[#2186FF] to-[rgba(33,134,255,0.15)] border border-[rgba(114,114,114,0.15)] shadow-md"
                              : "bg-white/15 hover:bg-white/20 border border-transparent cursor-pointer"
                          )}
                        >
                          <span
                            className={cn(
                              "font-medium text-[12px] leading-[18px] tracking-[-0.01em]",
                              isSelected ? "text-white font-semibold" : "text-[#E0E0E0]"
                            )}
                          >
                            {formatTimeDisplay(slot.startTime)}
                            {!isAvailable && " (Booked)"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="w-full bg-white/10 rounded-[12px] p-4 text-center">
                    <p className="text-white/70 text-sm">
                      No slots found for this date. Please select another date above.
                    </p>
                  </div>
                )}
              </div>

              {/* Info Box */}
              <div className="w-full bg-white/15 rounded-[6px] p-[22px] flex flex-col gap-[15px] mb-[30px]">
                <h3 className="text-white font-semibold text-[16px] leading-[24px] tracking-[-0.01em]">
                  You&apos;re Booking an Appointment
                </h3>
                <div className="flex flex-col gap-[8px]">
                  <span className="text-[#E0E0E0] font-normal text-[14px] leading-[21px] tracking-[-0.01em]">
                    You&apos;re scheduled for - {formattedSelectedDate} at {displayTime}
                  </span>
                  <span className="text-[#E0E0E0] font-normal text-[14px] leading-[21px] tracking-[-0.01em]">
                    {isTeamsRequested
                      ? "A Microsoft Teams meeting link will be emailed to you."
                      : `Location: ${location}`}
                  </span>
                  <span className="text-[#DDEBF8] font-medium text-[12px] leading-[18px] tracking-[-0.01em]">
                    Duration: {selectedSlot?.duration ? `${selectedSlot.duration} mins` : "1 hour"}
                  </span>
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={handleBook}
                disabled={bookingState !== "idle" || !selectedSlot || selectedSlot.status?.toLowerCase() !== "available"}
                className="w-full h-[42px] bg-gradient-to-br from-[#2186FF] to-[rgba(33,134,255,0.15)] rounded-[96px] flex items-center justify-center hover:opacity-90 transition disabled:opacity-50 shadow-lg"
              >
                {bookingState === "booking" ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                    <span className="text-white font-medium text-[14px]">Booking...</span>
                  </div>
                ) : (
                  <span className="text-white font-medium text-[14px] leading-[21px] text-center">
                    Book Appointment
                  </span>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Booking Dialogs */}
      <Dialog open={bookingState !== "idle"} onOpenChange={() => {}}>
        <DialogContent
          className="border-none w-[343px] p-0 rounded-[32px] overflow-hidden bg-transparent shadow-none"
          showCloseButton={false}
        >
          {bookingState === "booking" ? (
            <div className="w-full h-[338px] bg-gradient-to-b from-[#034593] to-[#01152D] shadow-[0px_4px_30px_rgba(33,134,255,0.15)] flex flex-col items-center justify-center relative p-6">
              <Loader2 className="w-[60px] h-[60px] text-white/80 animate-spin mb-[30px]" />
              <h2 className="font-semibold text-[22px] leading-[22px] text-center text-white mb-[10px]">
                Booking Your Appointment
              </h2>
              <p className="font-normal text-[14px] leading-[160%] text-center text-[#E0E0E0]">
                Please wait while we confirm your time slot.
              </p>
            </div>
          ) : (
            <div className="w-full h-[338px] bg-gradient-to-b from-[#034593] to-[#01152D] shadow-[0px_4px_30px_rgba(33,134,255,0.15)] flex flex-col items-center justify-center relative p-6">
              <div className="w-[79px] h-[79px] bg-white/15 rounded-full flex items-center justify-center mb-[25px]">
                <Check className="w-[45px] h-[45px] text-white" strokeWidth={3} />
              </div>
              <h2 className="font-semibold text-[22px] leading-[22px] text-center text-white mb-[15px]">
                Appointment Confirmed
              </h2>
              <p className="font-normal text-[14px] leading-[160%] text-center text-[#E0E0E0]">
                Your appointment has been successfully booked. A confirmation link will be sent to your email.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
