"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { toast } from "sonner";
import Image from "next/image";
import { Camera, CalendarIcon, Loader2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useUpdateProfile } from "@/features/users/api/users.queries";
import { User } from "@/features/auth";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ["image/webp", "image/png", "image/jpeg", "image/jpg"];

const editProfileSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  dob: z
    .any()
    .optional()
    .refine((val) => !val || (val instanceof Date && !isNaN(val.getTime())), {
      message: "Please enter a valid date",
    }),
  primaryAddress: z.string().optional(),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
}

export const EditProfileDialog = ({
  open,
  onOpenChange,
  user,
}: EditProfileDialogProps) => {
  const updateProfileMutation = useUpdateProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      dob: undefined,
      primaryAddress: "",
    },
  });

  useEffect(() => {
    if (open && user) {
      let parsedDob: Date | undefined = undefined;
      if (user.dob) {
        const d = new Date(user.dob);
        if (!isNaN(d.getTime())) {
          parsedDob = d;
        }
      }

      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        dob: parsedDob,
        primaryAddress: user.primaryAddress || "",
      });

      setPreviewUrl(user.profilePicture?.location || null);
      setSelectedFile(null);
      setImageError(null);
    }
  }, [open, user, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      const errorMsg = "File size exceeds 5MB limit";
      setImageError(errorMsg);
      toast.error(errorMsg);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      const errorMsg = "Invalid file type. Supported: WebP, PNG, JPG.";
      setImageError(errorMsg);
      toast.error(errorMsg);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setImageError(null);
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const onSubmit = (data: EditProfileFormData) => {
    if (imageError) {
      toast.error(imageError);
      return;
    }

    const payload: {
      firstName: string;
      lastName: string;
      dob?: string;
      primaryAddress?: string;
      profilePicture?: File;
    } = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      primaryAddress: data.primaryAddress?.trim() || undefined,
    };

    if (data.dob && data.dob instanceof Date && !isNaN(data.dob.getTime())) {
      payload.dob = format(data.dob, "yyyy-MM-dd");
    }

    if (selectedFile) {
      payload.profilePicture = selectedFile;
    }

    updateProfileMutation.mutate(payload, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  const fullName = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : user?.firstName || user?.lastName || "User";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[480px] w-full border border-white/15 bg-gradient-to-b from-[#034593] to-[#01152D] rounded-[24px] p-6 text-white max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div>
            <DialogTitle className="text-xl font-semibold text-white">Edit Profile</DialogTitle>
            <DialogDescription className="text-xs text-[#E0E0E0] mt-0.5">
              Update your personal details and profile picture.
            </DialogDescription>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 pt-2">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-2">
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
                "relative w-[96px] h-[96px] rounded-full overflow-hidden border-2 cursor-pointer group transition-all flex items-center justify-center bg-white/15",
                imageError ? "border-red-400 ring-2 ring-red-400/40" : "border-white/40 hover:border-white"
              )}
            >
              {previewUrl ? (
                <Image src={previewUrl} alt="Avatar preview" fill className="object-cover" />
              ) : (
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=0D8ABC&color=fff`}
                  alt={fullName}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                <Camera className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] font-medium">Change</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-[#2186FF] hover:underline cursor-pointer font-medium"
            >
              Change Photo
            </button>
            {imageError && (
              <p className="text-red-400 text-xs text-center font-medium bg-red-500/10 border border-red-500/20 py-1 px-3 rounded-lg">
                {imageError}
              </p>
            )}
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-4">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="firstName" className="text-xs font-medium text-[#E0E0E0]">
                  First Name <span className="text-red-400">*</span>
                </label>
                <Input
                  id="firstName"
                  placeholder="First name"
                  {...register("firstName")}
                  className={cn(
                    "h-[44px] rounded-[7px] border-none bg-white/15 text-white placeholder:text-[#A0A0A0] px-3.5 text-sm focus-visible:ring-1 focus-visible:ring-[#2186FF]",
                    errors.firstName && "ring-1 ring-red-400 bg-red-500/10"
                  )}
                />
                {errors.firstName && (
                  <p className="text-red-400 text-[11px]">{errors.firstName.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="lastName" className="text-xs font-medium text-[#E0E0E0]">
                  Last Name <span className="text-red-400">*</span>
                </label>
                <Input
                  id="lastName"
                  placeholder="Last name"
                  {...register("lastName")}
                  className={cn(
                    "h-[44px] rounded-[7px] border-none bg-white/15 text-white placeholder:text-[#A0A0A0] px-3.5 text-sm focus-visible:ring-1 focus-visible:ring-[#2186FF]",
                    errors.lastName && "ring-1 ring-red-400 bg-red-500/10"
                  )}
                />
                {errors.lastName && (
                  <p className="text-red-400 text-[11px]">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="dob" className="text-xs font-medium text-[#E0E0E0]">
                Date of Birth
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
                            "w-full h-[44px] rounded-[7px] border-none bg-white/15 text-white px-3.5 justify-start text-left font-normal hover:bg-white/20 hover:text-white transition-all text-sm",
                            !field.value && "text-[#A0A0A0]",
                            errors.dob && "ring-1 ring-red-400 bg-red-500/10"
                          )}
                        />
                      }
                    >
                      {field.value ? (
                        format(field.value, "dd MMMM yyyy")
                      ) : (
                        <span>Select Date of Birth</span>
                      )}
                      <CalendarIcon className="ml-auto w-4 h-4 opacity-60" />
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-[60]" align="start">
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
              {errors.dob && (
                <p className="text-red-400 text-[11px]">{String(errors.dob.message)}</p>
              )}
            </div>

            {/* Primary Address */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="primaryAddress" className="text-xs font-medium text-[#E0E0E0]">
                Primary Address
              </label>
              <Input
                id="primaryAddress"
                placeholder="Enter your address..."
                {...register("primaryAddress")}
                className="h-[44px] rounded-[7px] border-none bg-white/15 text-white placeholder:text-[#A0A0A0] px-3.5 text-sm focus-visible:ring-1 focus-visible:ring-[#2186FF]"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-2">
            <button
              type="button"
              className="flex-1 h-[46px] rounded-[100px] bg-white/10 font-medium text-sm text-white hover:bg-white/15 transition-colors cursor-pointer"
              onClick={() => onOpenChange(false)}
              disabled={updateProfileMutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-[46px] rounded-[100px] bg-gradient-to-r from-[#2186FF] to-[#034593] font-medium text-sm text-white hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
