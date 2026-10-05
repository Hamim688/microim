import React from "react"
import { Cpu, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface ProductCardProps {
  name: string
  category: string
  price: string
  stock: number
}

export function ProductCard({ name, category, price, stock }: ProductCardProps) {
  return (
    <div className="rounded-2xl bg-[#0c213d] border border-[#173359] p-5 flex flex-col justify-between hover:border-[#FFC928]/50 transition-all">
      <div>
        <div className="h-32 rounded-xl bg-[#071426] border border-[#173359] flex items-center justify-center p-4 mb-3 text-[#FFC928]">
          <Cpu className="w-8 h-8" />
        </div>
        <span className="text-[11px] font-mono text-[#94A3B8]">{category}</span>
        <h4 className="font-semibold text-white text-sm mt-1 mb-2 line-clamp-2">{name}</h4>
      </div>
      <div className="pt-3 border-t border-[#173359] flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 block">Stok: {stock}</span>
          <span className="text-sm font-bold text-[#FFC928]">{price}</span>
        </div>
        <Button size="sm" variant="outline">
          <ShoppingBag className="w-3 h-3" />
        </Button>
      </div>
    </div>
  )
}
