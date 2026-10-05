import React from "react"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export interface ProjectCardProps {
  title: string
  category: string
  description: string
  techStack: string[]
}

export function ProjectCard({ title, category, description, techStack }: ProjectCardProps) {
  return (
    <div className="rounded-2xl bg-[#0c213d] border border-[#173359] p-6 flex flex-col justify-between hover:border-[#FFC928]/50 transition-all">
      <div>
        <span className="text-xs font-mono text-[#FFC928] bg-[#FFC928]/10 px-2.5 py-0.5 rounded border border-[#FFC928]/20">
          {category}
        </span>
        <h3 className="text-lg font-bold text-white mt-3 mb-2">{title}</h3>
        <p className="text-sm text-slate-300 mb-4">{description}</p>
        <div className="flex flex-wrap gap-1 mb-4">
          {techStack.map((tech, i) => (
            <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#071426] text-slate-300">
              {tech}
            </span>
          ))}
        </div>
      </div>
      <Link href="/contact">
        <Button variant="secondary" size="sm" className="w-full flex items-center justify-center gap-1.5">
          Inquiry Proyek Serupa
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Button>
      </Link>
    </div>
  )
}
