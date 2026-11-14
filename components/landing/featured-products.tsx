import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Cpu, MessageCircle, RotateCcw } from "lucide-react"
import { whatsappLink } from "@/lib/site"
import type { CatalogProduct } from "@/lib/catalog"
import { stockInfo } from "@/components/products/stock"
import { ScrollReveal } from "@/components/landing/landing-motion"

// Label stok dari stockInfo berhuruf kapital ("STOK HABIS"); di etalase ditulis biasa ("Stok habis").
const sentenceCase = (text: string) => text.charAt(0) + text.slice(1).toLowerCase()

// Susunan etalase: kartu pertama besar (unggulan), dua kartu sedang, kartu keempat melebar.
const LAYOUT = ["is-feature", "", "", "is-wide"]

/**
 * Produk (Beranda): etalase asimetris berisi produk unggulan dari database (harga & stok selalu sama dengan admin).
 * Seluruh gambar dan nama menuju katalog; tombolnya langsung membuka WhatsApp untuk memesan atau menanyakan restock.
 */
export function FeaturedProducts({ products, total }: { products: CatalogProduct[]; total: number }) {
  if (products.length === 0) return null
  return (
    <section className="featured-products-section" id="products" aria-labelledby="products-heading">
      <div className="site-container">
        <ScrollReveal className="prod-head">
          <h2 id="products-heading">Siapkan Komponen untuk Proyekmu</h2>
          <div>
            <p>Papan mikrokontroler, kit robotika, sensor, dan aksesori pilihan untuk belajar, membuat purwarupa, dan mengembangkan sistem IoT.</p>
            <Link className="prod-all" href="/products">Lihat semua {total > products.length ? `${total} ` : ""}produk <ArrowRight aria-hidden="true" /></Link>
          </div>
        </ScrollReveal>

        <div className="prod-grid">
          {products.map((product, index) => {
            const stock = stockInfo(product.stock)
            const feature = index === 0
            return (
              <ScrollReveal key={product.slug} delay={index * 0.07} className={`prod-cell ${LAYOUT[index] ?? ""}`}>
                <article className={`prod-card${stock.available ? "" : " is-out"}`}>
                  <Link className="prod-media" href="/products" aria-label={`Lihat ${product.name} di katalog`}>
                    {product.image ? (
                      <Image src={product.image} alt="" fill sizes={feature ? "(max-width: 900px) 100vw, 50vw" : "(max-width: 900px) 100vw, 33vw"} />
                    ) : (
                      <span className="prod-placeholder" aria-hidden="true"><Cpu /></span>
                    )}
                  </Link>
                  <div className="prod-body">
                    <p className="prod-meta">
                      <span>{product.category}</span>
                      <span className={`prod-stock is-${stock.tone}`}><i aria-hidden="true" />{sentenceCase(stock.label)}</span>
                    </p>
                    <h3><Link href="/products">{product.name}</Link></h3>
                    {feature && product.description ? <p className="prod-desc">{product.description}</p> : null}
                    <div className="prod-foot">
                      <strong>{product.price}</strong>
                      {stock.available ? (
                        <a className="prod-buy" href={whatsappLink(`Halo Microim, saya ingin memesan ${product.name} (${product.price}).`)} target="_blank" rel="noopener noreferrer">
                          <MessageCircle aria-hidden="true" />Pesan<span className="sr-only"> {product.name} lewat WhatsApp</span>
                        </a>
                      ) : (
                        <a className="prod-buy is-restock" href={whatsappLink(`Halo Microim, apakah ${product.name} akan restock? Saya berminat membelinya.`)} target="_blank" rel="noopener noreferrer">
                          <RotateCcw aria-hidden="true" />Tanya restock<span className="sr-only"> {product.name} lewat WhatsApp</span>
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
