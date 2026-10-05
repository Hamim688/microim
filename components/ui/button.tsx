import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none rounded-xl",
          {
            "bg-[#FFC928] text-[#071426] hover:bg-[#e5b320] font-semibold shadow-[0_0_20px_rgba(255,201,40,0.25)] hover:shadow-[0_0_25px_rgba(255,201,40,0.4)]":
              variant === "primary",
            "bg-[#0c213d] text-white border border-[#173359] hover:border-[#FFC928]/50 hover:bg-[#132b4d]":
              variant === "secondary",
            "border border-[#FFC928]/60 text-[#FFC928] hover:bg-[#FFC928]/10":
              variant === "outline",
            "text-[#94A3B8] hover:text-[#FFC928] hover:bg-white/5":
              variant === "ghost",
            "px-3 py-1.5 text-xs": size === "sm",
            "px-5 py-2.5 text-sm": size === "md",
            "px-7 py-3 text-base": size === "lg",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
