"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setCookie } from "@/lib/cookie";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Image from "next/image";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  dob: z.date({
    message: "Date of birth is required",
  }),
  address: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const CompleteProfileForm = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const { register, handleSubmit, control, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", address: "" },
  });

  const onSubmit = (data: ProfileFormData) => {
    // Set dummy token so middleware allows access to protected routes
    setCookie("token", "dummy_token_123");
    // Include the profilePic (file or base64) in the actual API call
    router.push("/dashboard");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      const url = URL.createObjectURL(file);
      setProfilePic(url);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-[80%] mx-auto">
      <div className="flex flex-col gap-[25px] mb-[50px] text-center md:text-left">
        <h1 className="font-semibold text-[40px] leading-[60px] tracking-[-0.025em] text-white">
          Profile Info
        </h1>
        <p className="font-normal text-[16px] leading-[140%] text-[#E0E0E0]">
          Please submit your profile details!
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center gap-[23px]">
        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center gap-3 mb-4">
          <input
            type="file"
            accept="image/webp, image/png, image/jpeg, image/jpg"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative w-[132px] h-[132px] bg-white/15 rounded-[17px] flex items-center justify-center cursor-pointer hover:bg-white/20 border border-dashed border-[#2186FF] overflow-hidden"
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
        </div>

        {/* Inputs */}
        <div className="flex flex-col w-full gap-[23px]">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="font-medium text-[14px] leading-[150%] text-white">
              Name
            </label>
            <Input
              id="name"
              placeholder="Enter your name"
              {...register("name")}
              className="h-[51px] rounded-[7px] border-none bg-white/15 text-white placeholder:text-[#E0E0E0] px-5 focus-visible:ring-1 focus-visible:ring-[#2186FF]"
            />
            {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="dob" className="font-medium text-[14px] leading-[150%] text-white">
              Date of birth
            </label>
            <Controller
              name="dob"
              control={control}
              render={({ field }) => (
                <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                  <PopoverTrigger >
                    <Button
                      type="button"
                      className={cn(
                        "w-full h-[51px] rounded-[7px] border-none bg-white/15 text-white px-5 justify-start text-left font-normal hover:bg-white/15 hover:text-white",
                        !field.value && "text-[#E0E0E0]"
                      )}
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
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setIsDatePickerOpen(false);
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      captionLayout="dropdown"
                      startMonth={new Date(1900, 0)}
                      endMonth={new Date()}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.dob && <p className="text-red-400 text-xs">{errors.dob.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="address" className="font-medium text-[14px] leading-[150%] text-white">
              Primary Address<span className="text-xs font-normal italic pl-1">(Optional)</span>
            </label>
            <Input
              id="address"
              placeholder="Enter your address..."
              {...register("address")}
              className="h-[51px] rounded-[7px] border-none bg-white/15 text-white placeholder:text-[#E0E0E0] px-5 focus-visible:ring-1 focus-visible:ring-[#2186FF]"
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="rounded-blue"
          className="w-full mt-4"
        >
          Continue
        </Button>
      </form>
    </div>
  );
};
