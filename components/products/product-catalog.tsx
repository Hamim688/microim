"use client"

import { useState, type CSSProperties } from "react"
import Image from "next/image"
import { Cpu, MessageCircle, RotateCcw, Search } from "lucide-react"
import { whatsappLink } from "@/lib/site"
import { Segmented } from "@/components/layout/segmented"
import type { CatalogProduct } from "@/lib/catalog"
import { stockInfo } from "@/components/products/stock"

// Label stok dari stockInfo berhuruf kapital ("STOK HABIS"); di kartu ditulis biasa ("Stok habis").
const sentenceCase = (text: string) => text.charAt(0) + text.slice(1).toLowerCase()

/**
 * Katalog: cari nama produk, saring per kategori, dan sembunyikan yang stoknya habis. Kartunya memakai gaya yang
 * sama dengan etalase Produk di Beranda (.prod-card). Tombol tiap kartu membuka WhatsApp dengan pesan terisi:
 * "Pesan" bila ada stok, "Tanya restock" bila habis, "Konsultasi" untuk jasa.
 */
export function ProductCatalog({ products }: { products: CatalogProduct[] }) {
  const categories = ["Semua", ...Array.from(new Set(products.map((p) => p.category)))]
  const [category, setCategory] = useState("Semua")
  const [query, setQuery] = useState("")
  const [inStockOnly, setInStockOnly] = useState(false)

  if (products.length === 0) {
    return (
      <div className="cat-empty">
        <p>Katalog sedang diperbarui. Tanyakan ketersediaan komponen langsung lewat WhatsApp.</p>
        <a className="button-primary" href={whatsappLink("Halo Microim, saya ingin menanyakan ketersediaan komponen.")} target="_blank" rel="noopener noreferrer">
          <MessageCircle aria-hidden="true" />Tanya via WhatsApp
        </a>
      </div>
    )
  }

  const keyword = query.trim().toLowerCase()
  const visible = products.filter(
    (p) =>
      (category === "Semua" || p.category === category) &&
      (!keyword || p.name.toLowerCase().includes(keyword) || p.category.toLowerCase().includes(keyword)) &&
      (!inStockOnly || stockInfo(p.stock).available),
  )
  const reset = () => {
    setCategory("Semua")
    setQuery("")
    setInStockOnly(false)
  }

  return (
    <>
      <div className="cat-tools">
        <div className="inq-field cat-search">
          <label htmlFor="cat-search" className="sr-only">Cari produk</label>
          <Search aria-hidden="true" />
          <input id="cat-search" type="search" placeholder="Cari produk, mis. ESP32 atau servo" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <p aria-live="polite">{visible.length} dari {products.length} produk</p>
      </div>
      {/* Kapsul kaca melayang: kategori (pil emas meluncur) + sakelar stok. */}
      <div className="island-wrap">
        <div className="glass-island">
          <Segmented id="cat-kategori" label="Saring kategori produk" options={categories} value={category} onChange={setCategory} />
          <i className="island-sep" aria-hidden="true" />
          <button type="button" className="island-toggle" aria-pressed={inStockOnly} onClick={() => setInStockOnly(!inStockOnly)}><i aria-hidden="true" />Stok tersedia</button>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="cat-empty">
          <p>Tidak ada produk yang cocok dengan pencarianmu. Bisa jadi barangnya ada tapi belum masuk katalog.</p>
          <div>
            <button type="button" className="button-secondary" onClick={reset}>Tampilkan Semua</button>
            <a className="button-primary" href={whatsappLink(`Halo Microim, apakah ada ${query.trim() || "komponen yang saya cari"}?`)} target="_blank" rel="noopener noreferrer">
              <MessageCircle aria-hidden="true" />Tanya via WhatsApp
            </a>
          </div>
        </div>
      ) : (
        <div className="cat-grid">
          {visible.map((p, index) => {
            const stock = stockInfo(p.stock)
            const service = p.stock === null
            const message = !stock.available
              ? `Halo Microim, apakah ${p.name} akan restock? Saya berminat membelinya.`
              : service
                ? `Halo Microim, saya ingin konsultasi jasa ${p.name}.`
                : `Halo Microim, saya ingin memesan ${p.name} (${p.price}).`
            const action = !stock.available ? "Tanya restock" : service ? "Konsultasi" : "Pesan"
            return (
              // Kunci menyertakan saringan aktif supaya kartu muncul lagi dengan animasi tiap saringan berubah.
              <div key={`${category}-${inStockOnly}-${p.slug}`} className="cat-cell" style={{ "--n": Math.min(index, 12) } as CSSProperties}>
                <article className={`prod-card${stock.available ? "" : " is-out"}`}>
                  <div className="prod-media">
                    {p.image ? (
                      <Image src={p.image} alt="" fill sizes="(max-width: 520px) 100vw, (max-width: 820px) 50vw, (max-width: 1100px) 33vw, 25vw" />
                    ) : (
                      <span className="prod-placeholder" aria-hidden="true"><Cpu /></span>
                    )}
                  </div>
                  <div className="prod-body">
                    <p className="prod-meta">
                      <span>{p.category}</span>
                      <span className={`prod-stock is-${stock.tone}`}><i aria-hidden="true" />{sentenceCase(stock.label)}</span>
                    </p>
                    <h3>{p.name}</h3>
                    {p.description ? <p className="prod-desc">{p.description}</p> : null}
                    <div className="prod-foot">
                      <strong>{service ? <span>Mulai </span> : null}{p.price}</strong>
                      <a className={`prod-buy${stock.available ? "" : " is-restock"}`} href={whatsappLink(message)} target="_blank" rel="noopener noreferrer">
                        {stock.available ? <MessageCircle aria-hidden="true" /> : <RotateCcw aria-hidden="true" />}
                        {action}<span className="sr-only"> {p.name} lewat WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </article>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
