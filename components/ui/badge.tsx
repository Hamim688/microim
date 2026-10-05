import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "gold" | "navy" | "outline"
}

export function Badge({
  className,
  variant = "gold",
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase",
        {
          "bg-[#FFC928]/10 text-[#FFC928] border border-[#FFC928]/30 shadow-[0_0_10px_rgba(255,201,40,0.1)]":
            variant === "gold",
          "bg-[#0c213d] text-slate-300 border border-[#173359]":
            variant === "navy",
          "border border-slate-700 text-slate-400":
            variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}
