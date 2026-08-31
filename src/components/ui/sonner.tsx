"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  Loader2,
} from "lucide-react";

export const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      position="top-right"
      closeButton={true}
      duration={4000}
      className="toaster group"
      icons={{
        success: <CheckCircle2 className="size-5 text-emerald-400 shrink-0" />,
        info: <Info className="size-5 text-[#2186FF] shrink-0" />,
        warning: <AlertTriangle className="size-5 text-amber-400 shrink-0" />,
        error: <AlertCircle className="size-5 text-rose-400 shrink-0" />,
        loading: <Loader2 className="size-5 text-[#2186FF] animate-spin shrink-0" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#021838]/95 group-[.toaster]:backdrop-blur-xl group-[.toaster]:text-white group-[.toaster]:border group-[.toaster]:border-white/15 group-[.toaster]:shadow-[0_12px_40px_rgba(0,0,0,0.45)] group-[.toaster]:rounded-2xl group-[.toaster]:p-4 group-[.toaster]:gap-3 group-[.toaster]:items-center group-[.toaster]:font-sans",
          title: "group-[.toast]:text-sm group-[.toast]:font-semibold group-[.toast]:text-white tracking-tight",
          description: "group-[.toast]:text-xs group-[.toast]:text-[#E0E0E0] group-[.toast]:leading-relaxed mt-0.5",
          actionButton:
            "group-[.toast]:bg-[#2186FF] group-[.toast]:text-white group-[.toast]:hover:bg-[#1b72dc] group-[.toast]:rounded-xl group-[.toast]:font-medium group-[.toast]:text-xs group-[.toast]:px-3 group-[.toast]:py-1.5 transition-colors",
          cancelButton:
            "group-[.toast]:bg-white/10 group-[.toast]:text-white group-[.toast]:hover:bg-white/20 group-[.toast]:rounded-xl group-[.toast]:text-xs transition-colors",
          closeButton:
            "group-[.toast]:bg-white/10 group-[.toast]:text-white group-[.toast]:border-white/20 hover:group-[.toast]:bg-white/20 hover:group-[.toast]:text-white group-[.toast]:transition-colors",
          error:
            "group-[.toaster]:!bg-[#1c080d]/95 group-[.toaster]:!border-rose-500/40 group-[.toaster]:!text-white group-[.toaster]:shadow-[0_8px_30px_rgba(244,63,94,0.25)]",
          success:
            "group-[.toaster]:!bg-[#041c14]/95 group-[.toaster]:!border-emerald-500/40 group-[.toaster]:!text-white group-[.toaster]:shadow-[0_8px_30px_rgba(16,185,129,0.25)]",
          warning:
            "group-[.toaster]:!bg-[#221504]/95 group-[.toaster]:!border-amber-500/40 group-[.toaster]:!text-white group-[.toaster]:shadow-[0_8px_30px_rgba(245,158,11,0.25)]",
          info:
            "group-[.toaster]:!bg-[#031d3d]/95 group-[.toaster]:!border-[#2186FF]/40 group-[.toaster]:!text-white group-[.toaster]:shadow-[0_8px_30px_rgba(33,134,255,0.25)]",
        },
      }}
      {...props}
    />
  );
};
