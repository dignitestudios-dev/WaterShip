import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <InputPrimitive
        type={type}
        data-slot="input"
        className={cn(
          "flex h-[40px] w-full rounded-[7px] border border-transparent bg-white/15 px-4 py-2 text-[12px] text-[#E0E0E0] outline-none transition-colors",
          "placeholder:text-[#E0E0E0]/70",
          "focus-visible:border-[#2186FF] focus-visible:ring-1 focus-visible:ring-[#2186FF]",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "aria-invalid:border-red-500 aria-invalid:ring-1 aria-invalid:ring-red-500",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
