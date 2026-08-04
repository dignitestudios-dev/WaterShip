"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { removeCookie } from "@/lib/cookie";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function ProfilePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [openSection, setOpenSection] = useState<string[]>(["Personal Information", "Privacy & Security"]);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleSection = (section: string) => {
    setOpenSection(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  if (!mounted) return null;

  const handleLogout = () => {
    // Clear the token cookie
    removeCookie("token");
    // Redirect to login page
    router.push("/login");
  };

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen relative overflow-hidden bg-gradient-to-b from-[#034593] to-[#01152D]">
      
      {/* Background Vectors */}
      <div className="absolute left-[calc(50%-451.09px/2-738.45px)] top-[-189px] w-[451.09px] h-[492px] bg-[#2186FF] opacity-45 blur-[203.65px] pointer-events-none" />
      <div className="absolute right-[-206.09px] bottom-[-167px] w-[451.09px] h-[492px] bg-[#2186FF] opacity-45 blur-[203.65px] pointer-events-none" />

      {/* Back Button */}
      <div 
        className="absolute left-[50px] top-[120px] md:top-[115px] w-[30px] h-[30px] rounded-full bg-white/15 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors z-10" 
        onClick={() => router.push("/dashboard")}
      >
        <ChevronLeft className="w-[18px] h-[18px] text-white" strokeWidth={2} />
      </div>

      <div className="flex flex-col items-center w-full max-w-[568px] z-10 mt-20 gap-[30px] px-[20px]">
        {/* Profile Info Header */}
        <div className="flex flex-col items-center gap-[10px]">
          <div className="w-[94px] h-[94px] rounded-full border-[2px] border-white overflow-hidden relative">
             {/* Real image if available, else placeholder */}
             <img src="/images/avatar.jpg" alt="Olivia Rose" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=Olivia+Rose&background=0D8ABC&color=fff'; }} />
          </div>
          <div className="flex flex-col items-center gap-[4px]">
            <h2 className="font-normal text-[21.31px] leading-[32px] tracking-[-0.01em] text-white">Olivia Rose</h2>
            <a href="mailto:client@adamsapp.com" className="font-normal text-[11.84px] leading-[18px] underline text-[#E0E0E0]">client@adamsapp.com</a>
          </div>
        </div>

        {/* Profile Menu Items */}
        <div className="w-full flex flex-col gap-[10px]">
          
          {/* Personal Information */}
          <div 
            className="w-full bg-white/15 rounded-[10px] flex flex-col p-[20px] gap-[10px] cursor-pointer overflow-hidden transition-all"
            onClick={() => toggleSection("Personal Information")}
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-medium text-[16px] leading-[24px] tracking-[-0.01em] text-white">
                Personal Information
              </span>
              <ChevronRight className={cn("w-[18px] h-[18px] text-white transition-transform duration-300", openSection.includes("Personal Information") ? "rotate-90" : "rotate-0")} />
            </div>
            
            {openSection.includes("Personal Information") && (
              <div className="flex flex-col gap-[15px] mt-[5px] w-full">
                <div className="w-full border-t border-white/15" />
                <div className="flex flex-col gap-[10px]">
                  <div className="flex items-center gap-[10px]">
                    <span className="font-medium text-[14px] leading-[21px] tracking-[-0.01em] text-[#E0E0E0] w-[50px]">
                      Name:
                    </span>
                    <span className="font-normal text-[14px] leading-[21px] tracking-[-0.01em] text-[#E0E0E0]">
                      Olivia Rose
                    </span>
                  </div>
                  <div className="flex items-center gap-[10px]">
                    <span className="font-medium text-[14px] leading-[21px] tracking-[-0.01em] text-[#E0E0E0] w-[50px]">
                      Email:
                    </span>
                    <span className="font-normal text-[14px] leading-[21px] text-[#E0E0E0]">
                      client@adamsapp.com
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notification Preferences */}
          <div 
            className="w-full h-[48px] bg-white/15 rounded-[10px] flex items-center justify-between px-[20px] cursor-pointer hover:bg-white/20 transition-colors"
            onClick={() => router.push("/dashboard/profile/notifications")}
          >
            <span className="font-medium text-[16px] leading-[24px] tracking-[-0.01em] text-white">
              Notification Preferences
            </span>
            <ChevronRight className="w-[18px] h-[18px] text-white" />
          </div>

          {/* Privacy & Security */}
          <div 
            className="w-full bg-white/15 rounded-[10px] flex flex-col p-[20px] gap-[10px] cursor-pointer overflow-hidden transition-all"
            onClick={() => toggleSection("Privacy & Security")}
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-medium text-[16px] leading-[24px] tracking-[-0.01em] text-white">
                Privacy & Security
              </span>
              <ChevronRight className={cn("w-[18px] h-[18px] text-white transition-transform duration-300", openSection.includes("Privacy & Security") ? "rotate-90" : "rotate-0")} />
            </div>
            
            {openSection.includes("Privacy & Security") && (
              <div className="flex flex-col gap-[15px] mt-[5px] w-full">
                <div className="w-full border-t border-white/15" />
                <div className="flex flex-col gap-[10px]">
                  <span 
                    className="font-medium text-[14px] leading-[21px] tracking-[-0.01em] text-[#E0E0E0] cursor-pointer hover:text-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push("/privacy");
                    }}
                  >
                    Privacy Policy
                  </span>
                  <span 
                    className="font-medium text-[14px] leading-[21px] tracking-[-0.01em] text-[#E0E0E0] cursor-pointer hover:text-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push("/terms");
                    }}
                  >
                    Terms & Conditions
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Logout */}
          <div 
            className="w-full h-[48px] bg-white/15 rounded-[10px] flex items-center justify-between px-[20px] cursor-pointer hover:bg-white/20 transition-colors"
            onClick={() => setShowLogoutDialog(true)}
          >
            <span className="font-medium text-[16px] leading-[24px] tracking-[-0.01em] text-white">
              Logout
            </span>
            <ChevronRight className="w-[18px] h-[18px] text-white" />
          </div>

        </div>
      </div>

      {/* Logout Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="max-w-[400px] border-none bg-gradient-to-b from-[#034593] to-[#01152D] rounded-[30px] p-[40px] flex flex-col items-center gap-[25px]">
          {/* We hide the title/description visually but include them for screen readers */}
          <DialogTitle className="sr-only">Log Out</DialogTitle>
          <DialogDescription className="sr-only">Confirm if you want to log out.</DialogDescription>
          
          <div className="w-[84px] h-[84px] rounded-full bg-white/10 flex items-center justify-center">
            <HelpCircle className="w-[48px] h-[48px] text-white" />
          </div>
          
          <div className="flex flex-col items-center gap-[10px] text-center">
            <h3 className="font-semibold text-[32px] leading-[40px] text-white">
              Log Out?
            </h3>
            <p className="font-normal text-[16px] leading-[140%] text-[#E0E0E0] max-w-[280px]">
              Are you sure you want to log out of your account?
            </p>
          </div>

          <div className="flex items-center gap-[20px] w-full mt-[10px]">
            <button 
              className="flex-1 h-[54px] rounded-[100px] bg-white/10 font-medium text-[16px] text-white hover:bg-white/15 transition-colors"
              onClick={() => setShowLogoutDialog(false)}
            >
              Cancel
            </button>
            <button 
              className="flex-1 h-[54px] rounded-[100px] bg-gradient-to-r from-[#2186FF] to-[#034593] font-medium text-[16px] text-white hover:opacity-90 transition-opacity"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
