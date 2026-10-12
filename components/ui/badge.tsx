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
        "inline-flex items-center gap-2 px-2.5 py-1.5 rounded-[2px] font-mono text-[11px] font-medium leading-none tracking-[0.1em] uppercase",
        {
          "bg-[#0c213d]/75 text-[#FFC928] border border-[#FFC928]/35":
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
