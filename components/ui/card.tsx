import * as React from "react"
import { cn } from "@/lib/utils"

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-[#0c213d]/80 border border-[#173359] p-6 text-white shadow-xl transition-all duration-300 hover:border-[#FFC928]/40 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]",
        className
      )}
      {...props}
    />
  )
}
