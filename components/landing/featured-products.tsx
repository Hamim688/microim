import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Cpu, MessageCircle, RotateCcw } from "lucide-react"
import { whatsappLink } from "@/lib/site"
import type { CatalogProduct } from "@/lib/catalog"
import { stockInfo } from "@/components/products/stock"
import { ScrollReveal } from "@/components/landing/landing-motion"

export function FeaturedProducts({ products }: { products: CatalogProduct[] }) {
  if (products.length === 0) return null
  return (
    <section className="featured-products-section" id="products">
      <div className="site-container">
        <ScrollReveal className="featured-products-heading">
          <div>
            <span className="section-kicker">KATALOG KOMPONEN MICROIM</span>
            <h2>Siapkan Komponen untuk Proyekmu</h2>
            <p>Papan mikrokontroler, kit robotika, sensor, dan aksesori pilihan untuk belajar, membuat purwarupa, dan mengembangkan sistem IoT.</p>
          </div>
          <Link className="featured-products-link" href="/products">LIHAT SEMUA PRODUK <ArrowRight aria-hidden="true" /></Link>
        </ScrollReveal>

        <div className="featured-products-grid">
          {products.map((product, index) => {
            const stock = stockInfo(product.stock)
            return (
              <ScrollReveal key={product.slug} delay={index * 0.08}>
                <article className="featured-product-card">
                  <Link className="featured-product-image" href="/products" aria-label={`Lihat ${product.name}`}>
                    {product.image ? (
                      <Image src={product.image} alt={product.name} width={512} height={279} sizes="(max-width: 760px) 100vw, 33vw" />
                    ) : (
                      <span className="featured-product-placeholder" aria-hidden="true"><Cpu /></span>
                    )}
                    <span className="featured-product-category">{product.category.toUpperCase()}</span>
                    <span className={`featured-product-stock is-${stock.tone}`}><i /> {stock.label}</span>
                  </Link>
                  <div className="featured-product-info">
                    <h3><Link href="/products">{product.name}</Link></h3>
                    <div className="featured-product-bottom">
                      <div><span>HARGA</span><strong>{product.price}</strong></div>
                      {stock.available ? (
                        <a className="featured-product-buy" href={whatsappLink(`Halo Microim, saya ingin memesan ${product.name} (${product.price}).`)} target="_blank" rel="noopener noreferrer" aria-label={`Pesan ${product.name} lewat WhatsApp`}><MessageCircle aria-hidden="true" /> PESAN</a>
                      ) : (
                        <a className="featured-product-buy is-restock" href={whatsappLink(`Halo Microim, apakah ${product.name} akan restock? Saya berminat membelinya.`)} target="_blank" rel="noopener noreferrer" aria-label={`Tanya restock ${product.name} lewat WhatsApp`}><RotateCcw aria-hidden="true" /> RESTOCK?</a>
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
