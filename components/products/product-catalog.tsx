"use client"

import { useState } from "react"
import Image from "next/image"
import { Cpu, MessageCircle, RotateCcw } from "lucide-react"
import { motion } from "motion/react"
import { whatsappLink } from "@/lib/site"
import type { CatalogProduct } from "@/lib/catalog"
import { stockInfo } from "@/components/products/stock"

export function ProductCatalog({ products }: { products: CatalogProduct[] }) {
  const categories = ["Semua", ...Array.from(new Set(products.map((p) => p.category)))]
  const [active, setActive] = useState("Semua")
  const visible = active === "Semua" ? products : products.filter((p) => p.category === active)

  if (products.length === 0) {
    return <p className="text-slate-300">Katalog sedang diperbarui. Tanyakan ketersediaan komponen langsung lewat WhatsApp.</p>
  }

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-[#173359]" role="group" aria-label="Filter kategori produk">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={active === c}
            onClick={() => setActive(c)}
            className={`px-4 py-2 rounded-[3px] font-mono text-[11px] uppercase tracking-[0.08em] transition-colors cursor-pointer ${
              active === c
                ? "bg-[#FFC928] text-[#071426] font-semibold border border-[#FFC928]"
                : "bg-[#0c213d] text-slate-300 hover:border-[#FFC928]/50 hover:text-white border border-[#173359]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {visible.map((p, idx) => {
          const stock = stockInfo(p.stock)
          const message = stock.available
            ? `Halo Microim, saya ingin memesan ${p.name} (${p.price}).`
            : `Halo Microim, apakah ${p.name} akan restock? Saya berminat membelinya.`
          return (
            <motion.div
              key={`${active}-${p.slug}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: Math.min(idx, 12) * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <article className="product-catalog-card rounded-[6px] bg-[#0c213d] border border-[#173359] p-4 flex h-full flex-col justify-between hover:border-[#FFC928]/50 transition-all group">
                <div>
                  <div className="product-catalog-image relative aspect-[4/3] w-full rounded-[4px] bg-[#071426] border border-[#173359] overflow-hidden mb-4">
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className={`object-cover transition-transform duration-500 group-hover:scale-105${stock.available ? "" : " opacity-60 grayscale-[40%]"}`}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[#FFC928]/70" aria-hidden="true">
                        <Cpu className="w-10 h-10" />
                      </div>
                    )}
                    <span className={`stock-chip stock-chip--${stock.tone}`}><i aria-hidden="true" />{stock.label}</span>
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#FFC928]">{p.category}</span>
                  <h3 className="font-display font-semibold text-white text-base leading-snug mt-1 mb-2 line-clamp-2">{p.name}</h3>
                  {p.description ? <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">{p.description}</p> : null}
                </div>
                <div className="pt-4 mt-3 border-t border-[#173359] flex items-center justify-between gap-3">
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-slate-400 block">{p.stock === null ? "Mulai dari" : "Harga"}</span>
                    <span className="text-base font-bold text-[#FFC928]">{p.price}</span>
                  </div>
                  <a
                    href={whatsappLink(message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={stock.available ? `Pesan ${p.name} lewat WhatsApp` : `Tanya restock ${p.name} lewat WhatsApp`}
                    className={`inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-[3px] border px-3 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors ${
                      stock.available
                        ? "border-[#FFC928]/60 text-[#FFC928] hover:bg-[#FFC928] hover:text-[#071426]"
                        : "border-slate-500/60 text-slate-300 hover:border-slate-300 hover:text-white"
                    }`}
                  >
                    {stock.available ? <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" /> : <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />}
                    {p.stock === null ? "Konsultasi" : stock.available ? "Pesan" : "Tanya Restock"}
                  </a>
                </div>
              </article>
            </motion.div>
          )
        })}
      </div>
    </>
  )
}
