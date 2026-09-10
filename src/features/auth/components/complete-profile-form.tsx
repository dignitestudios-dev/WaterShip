"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useCompleteProfile } from "@/features/users/api/users.queries";
import { useLogout } from "@/features/auth/api/auth.mutations";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ["image/webp", "image/png", "image/jpeg", "image/jpg"];

const isAtLeast13YearsOld = (date: Date) => {
  const today = new Date();
  const minDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
  return date <= minDate;
};

const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required"),
  dob: z
    .any()
    .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
      message: "Date of birth is required",
    })
    .refine((val) => val instanceof Date && isAtLeast13YearsOld(val), {
      message: "You must be at least 13 years old to register",
    }),
  address: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const CompleteProfileForm = () => {
  const router = useRouter();
  const completeProfileMutation = useCompleteProfile();
  const logoutMutation = useLogout();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      address: "",
      dob: undefined,
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    // Defensive check: Do not proceed or enter saving state if required fields are missing
    if (!data.name || !data.name.trim()) {
      return;
    }
    if (!data.dob || !(data.dob instanceof Date) || isNaN(data.dob.getTime())) {
      return;
    }
    if (!isAtLeast13YearsOld(data.dob)) {
      toast.error("You must be at least 13 years old to register");
      return;
    }
    if (imageError) {
      toast.error(imageError);
      return;
    }

    const payload: any = {
      firstName: data.name.trim().split(" ")[0] || "",
      lastName: data.name.trim().split(" ").slice(1).join(" ") || "",
      dob: format(data.dob, "yyyy-MM-dd"),
      primaryAddress: data.address?.trim() || undefined,
    };

    const file = fileInputRef.current?.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setImageError("File size must be less than 5MB");
        toast.error("File size must be less than 5MB");
        return;
      }
      payload.profilePicture = file;
    }

    completeProfileMutation.mutate(payload);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate maximum file size (5MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const fileSizeMb = (file.size / (1024 * 1024)).toFixed(1);
      const errorMsg = `File size (${fileSizeMb}MB) exceeds the allowed 5MB limit. Please upload an image under 5MB.`;
      setImageError(errorMsg);
      toast.error("File size exceeds the allowed 5MB limit");
      // Reset input element so oversized file is cleared
      if (fileInputRef.current) fileInputRef.current.value = "";
      e.target.value = "";
      return;
    }

    // Validate supported image formats
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      const errorMsg = "Invalid file type. Supported formats: WebP, PNG, JPG.";
      setImageError(errorMsg);
      toast.error(errorMsg);
      if (fileInputRef.current) fileInputRef.current.value = "";
      e.target.value = "";
      return;
    }

    setImageError(null);
    const url = URL.createObjectURL(file);
    setProfilePic(url);
  };

  const isSubmitting = completeProfileMutation.isPending || completeProfileMutation.isSuccess;

  return (
    <div className="flex flex-col w-full max-w-[80%] mx-auto">
      <div className="flex items-start justify-between mb-[30px] gap-4">
        <div className="flex flex-col gap-[10px] text-center md:text-left">
          <h1 className="font-semibold text-[32px] md:text-[40px] leading-[120%] tracking-[-0.025em] text-white">
            Profile Info
          </h1>
          <p className="font-normal text-[15px] md:text-[16px] leading-[140%] text-[#E0E0E0]">
            Please submit your profile details!
          </p>
        </div>

        <button
          type="button"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 hover:text-white text-xs font-medium transition-all cursor-pointer shrink-0 disabled:opacity-50"
          title="Log out and switch account"
        >
          <LogOut className="w-3.5 h-3.5 text-red-400" />
          <span>{logoutMutation.isPending ? "Logging out..." : "Log Out"}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center gap-[23px]">
        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center gap-2 mb-2">
          <input
            type="file"
            accept="image/webp, image/png, image/jpeg, image/jpg"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}

          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "relative w-[132px] h-[132px] bg-white/15 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/20 border border-dashed overflow-hidden transition-all",
              imageError ? "border-red-400 ring-2 ring-red-400/40" : "border-[#2186FF]"
            )}
          >
            {profilePic ? (
              <Image src={profilePic} alt="Profile preview" fill className="object-cover" />
            ) : (
              <Plus className="w-12 h-12 text-white" />
            )}
          </div>
          <span className="font-medium text-[14px] leading-[150%] text-white">
            Profile Picture
          </span>
          <span className="text-[12px] text-[#E0E0E0] text-center">
            Supported formats: WebP, PNG, JPG (Max 5MB)
          </span>

          {imageError && (
            <p className="text-red-400 text-xs text-center font-medium max-w-[280px] mt-1 bg-red-500/10 border border-red-500/20 py-1.5 px-3 rounded-lg">
              {imageError}
            </p>
          )}
        </div>

        {/* Inputs */}
        <div className="flex flex-col w-full gap-[23px]">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="font-medium text-[14px] leading-[150%] text-white">
              Name <span className="text-red-400">*</span>
            </label>
            <Input
              id="name"
              placeholder="Enter your name"
              {...register("name")}
              className={cn(
                "h-[51px] rounded-[7px] border-none bg-white/15 text-white placeholder:text-[#E0E0E0] px-5 focus-visible:ring-1 focus-visible:ring-[#2186FF]",
                errors.name && "ring-1 ring-red-400 bg-red-500/10"
              )}
              maxLength={50}

            />
            {errors.name && <p className="text-red-400 text-xs mt-0.5">{errors.name.message}</p>}
          </div>
          {/*  */}
          <div className="flex flex-col gap-2">
            <label htmlFor="dob" className="font-medium text-[14px] leading-[150%] text-white">
              Date of birth <span className="text-red-400">*</span>
            </label>
            <Controller
              name="dob"
              control={control}
              render={({ field }) => (
                <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                  <PopoverTrigger
                    render={
                      <Button
                        type="button"
                        className={cn(
                          "w-full h-[51px] rounded-[7px] border-none bg-white/15 text-white px-5 justify-start text-left font-normal hover:bg-white/20 hover:text-white transition-all",
                          !field.value && "text-[#E0E0E0]",
                          errors.dob && "ring-1 ring-red-400 bg-red-500/10"
                        )}
                      />
                    }
                  >
                    {field.value ? format(field.value, "dd MMMM yyyy") : <span>Select Date of Birth</span>}
                    <svg
                      className="ml-auto w-4 h-4 opacity-50"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setIsDatePickerOpen(false);
                      }}
                      disabled={(date) => {
                        const today = new Date();
                        const minDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
                        return date > minDate || date < new Date("1900-01-01");
                      }}
                      captionLayout="dropdown"
                      startMonth={new Date(1900, 0)}
                      endMonth={new Date(new Date().getFullYear() - 13, new Date().getMonth())}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.dob && <p className="text-red-400 text-xs mt-0.5">{String(errors.dob.message)}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="address" className="font-medium text-[14px] leading-[150%] text-white">
              Primary Address<span className="text-xs font-normal italic pl-1">(Optional)</span>
            </label>
            <Input
              id="address"
              placeholder="Enter your address..."
              {...register("address")}
              maxLength={250}
              className="h-[51px] rounded-[7px] border-none bg-white/15 text-white placeholder:text-[#E0E0E0] px-5 focus-visible:ring-1 focus-visible:ring-[#2186FF]"
            />
          </div>
        </div>

        <div className="w-full flex flex-col items-center gap-3 mt-4">
          <Button
            type="submit"
            variant="rounded-blue"
            className="w-full"
            disabled={isSubmitting || logoutMutation.isPending}
          >
            {isSubmitting ? "Saving..." : "Continue"}
          </Button>

          <button
            type="button"
            onClick={() => logoutMutation.mutate()}
            disabled={isSubmitting || logoutMutation.isPending}
            className="text-xs text-[#E0E0E0] hover:text-white underline cursor-pointer transition-colors disabled:opacity-50"
          >
            Want to use a different account? <span className="font-semibold text-white">Log out</span>
          </button>
        </div>
      </form>
    </div>
  );
};
