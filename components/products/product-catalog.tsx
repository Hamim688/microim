"use client"

import { useState } from "react"
import Image from "next/image"
import { MessageCircle } from "lucide-react"
import { motion } from "motion/react"
import { whatsappLink } from "@/lib/site"

export type CatalogProduct = {
  name: string
  cat: string
  price: string
  stock: number
  image: string
}

export function ProductCatalog({ products }: { products: CatalogProduct[] }) {
  const categories = ["Semua", ...Array.from(new Set(products.map((p) => p.cat)))]
  const [active, setActive] = useState("Semua")
  const visible = active === "Semua" ? products : products.filter((p) => p.cat === active)

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
        {visible.map((p, idx) => (
          <motion.div
            key={`${active}-${p.name}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <article className="product-catalog-card rounded-[6px] bg-[#0c213d] border border-[#173359] p-4 flex h-full flex-col justify-between hover:border-[#FFC928]/50 transition-all group">
              <div>
                <div className="product-catalog-image relative h-44 rounded-[4px] bg-[#071426] border border-[#173359] overflow-hidden mb-4">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#FFC928]">{p.cat}</span>
                <h3 className="font-display font-semibold text-white text-base leading-snug mt-1 mb-2 line-clamp-2">{p.name}</h3>
              </div>
              <div className="pt-4 border-t border-[#173359] flex items-center justify-between">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-slate-400 block">Stok: {p.stock}</span>
                  <span className="text-base font-bold text-[#FFC928]">{p.price}</span>
                </div>
                <a
                  href={whatsappLink(`Halo MikroIm, saya ingin memesan ${p.name} (${p.price}).`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Pesan ${p.name} lewat WhatsApp`}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[3px] border border-[#FFC928]/60 px-3 font-mono text-[11px] uppercase tracking-[0.08em] text-[#FFC928] transition-colors hover:bg-[#FFC928] hover:text-[#071426]"
                >
                  <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" /> Pesan
                </a>
              </div>
            </article>
          </motion.div>
        ))}
      </div>
    </>
  )
}
