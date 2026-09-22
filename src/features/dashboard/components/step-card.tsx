import { ChevronRight, Check, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepCardProps {
  stepNumber: number;
  title: string;
  subtitle: string;
  progress: number; // 0 to 100
  totalSteps?: number;
  completedSteps?: number;
  badge?: "incomplete" | "completed" | "button";
  buttonText?: string;
  isFullyCompleted?: boolean;
  onClick?: () => void;
}

export const StepCard = ({
  stepNumber,
  title,
  subtitle,
  progress,
  totalSteps,
  completedSteps,
  badge,
  buttonText,
  isFullyCompleted,
  onClick,
}: StepCardProps) => {
  const radius = 27.9;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * progress) / 100;

  // Derive totalSteps and completedSteps if not explicitly provided
  let derivedTotal = totalSteps;
  let derivedCompleted = completedSteps;

  if (derivedTotal === undefined) {
    const match = subtitle.match(/(\d+)\s+of\s+(\d+)/i);
    if (match) {
      derivedCompleted = parseInt(match[1], 10);
      derivedTotal = parseInt(match[2], 10);
    }
  }

  const totalSegments = derivedTotal && derivedTotal > 0 ? derivedTotal : 4;
  const effectiveCompletedSteps = derivedCompleted !== undefined
    ? derivedCompleted
    : (isFullyCompleted ? totalSegments : undefined);

  return (
    <div 
      onClick={onClick}
      className={cn(
        "w-[343px] h-[185px] bg-[#EDEDED] rounded-[17px] relative overflow-hidden flex flex-col items-center justify-start shadow-sm transition mx-auto",
        onClick ? "cursor-pointer hover:shadow-md" : "cursor-default"
      )}
    >
      
      {/* Abstract blobs inside card */}
      <div className="absolute -bottom-[34px] -right-[12.65px] w-[150.65px] h-[164px] bg-[#2186FF] opacity-75 blur-[129.45px] pointer-events-none" />
      
      {/* Chevron or Check Top Right */}
      {isFullyCompleted ? (
        <CheckCircle2 className="absolute top-[16px] right-[16px] w-[20px] h-[20px] text-[#22A042]" strokeWidth={2} />
      ) : onClick ? (
        <ChevronRight className="absolute top-[16px] right-[16px] w-[18px] h-[18px] text-[#034593]" strokeWidth={2} />
      ) : null}

      {/* Pie chart */}
      <div className="relative w-[62px] h-[62px] flex items-center justify-center mt-[15px]">
        <svg width="62" height="62" viewBox="0 0 62 62" className="transform -rotate-90 absolute">
          {/* Background circle */}
          <circle 
            cx="31" 
            cy="31" 
            r={radius} 
            stroke="rgba(3, 69, 147, 0.45)" 
            strokeWidth="6.2" 
            fill="none" 
          />
          {/* Progress circle */}
          <circle 
            cx="31" 
            cy="31" 
            r={radius} 
            stroke="#034593" 
            strokeWidth="6.2" 
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-in-out"
          />
        </svg>
        <span className="text-[#2A2A2A] text-[14px] font-semibold leading-[21px] tracking-[-0.01em] relative z-10 flex items-center justify-center">
          {progress === 100 ? (
            <Check className="w-5 h-5 text-[#034593]" strokeWidth={3} />
          ) : (
            `${progress}%`
          )}
        </span>
      </div>
      
      {/* Text Content */}
      <div className="mt-[12px] flex flex-col items-center z-10 w-full px-4">
        <h3 className="text-[#2A2A2A] text-[17px] font-medium leading-[24px] tracking-[-0.01em]">
          {title}
        </h3>
        {badge ? (
          <div className="mt-1 flex flex-col items-center gap-[5px]">
            <p className="text-[#525252] text-[13px] leading-[20px] tracking-[-0.01em]">
              {subtitle}
            </p>
            {badge === "incomplete" && (
              <span className="px-[12px] py-[3px] bg-[rgba(3,69,147,0.15)] border-[0.75px] border-[rgba(3,69,147,0.15)] rounded-[100px] text-[#034593] text-[10px] font-medium leading-[14px] tracking-[-0.01em]">
                Incomplete
              </span>
            )}
            {badge === "completed" && (
              <div className="bg-[#E1F7E8] px-[12px] py-[3px] rounded-[100px] flex items-center justify-center border-[0.75px] border-[#E1F7E8]">
                <span className="text-[#1E9F44] text-[10px] font-medium leading-[14px] tracking-[-0.01em]">
                  Completed
                </span>
              </div>
            )}
            {badge === "button" && (
              <button className="px-[14px] py-[4px] bg-[#034593] rounded-[100px] text-white text-[11px] font-medium leading-[16px] tracking-[-0.01em] hover:bg-[#034593]/90 transition">
                {buttonText || "Book Now"}
              </button>
            )}
          </div>
        ) : (
          <p className="text-[#525252] text-[13px] leading-[20px] tracking-[-0.01em] mt-[4px]">
            {subtitle}
          </p>
        )}
      </div>
      
      {/* Bottom visual progress lines - Only for cards without badges */}
      {!badge && totalSegments > 0 && (
        <div className="absolute bottom-[24px] left-[63px] right-[63px] flex items-center gap-[3px] z-10 w-[217px]">
          {Array.from({ length: totalSegments }, (_, idx) => idx + 1).map((i) => {
            const isFilled =
              isFullyCompleted ||
              (effectiveCompletedSteps !== undefined
                ? i <= effectiveCompletedSteps
                : progress >= (i / totalSegments) * 100);

            return (
              <div
                key={i}
                className={cn(
                  "flex-1 h-0 border-[2px] rounded-full transition-all duration-500",
                  isFilled
                    ? "border-[#034593] opacity-100"
                    : "border-[#034593] opacity-45"
                )}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
