import React from "react"
import { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"

export interface ServiceCardProps {
  title: string
  description: string
  icon?: LucideIcon
}

export function ServiceCard({ title, description, icon: Icon }: ServiceCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      {Icon && (
        <div className="w-10 h-10 rounded-xl bg-[#173359] text-[#FFC928] flex items-center justify-center">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="text-sm text-slate-300">{description}</p>
    </Card>
  )
}
