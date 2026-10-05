import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ShoppingBag } from "lucide-react"
import { ScrollReveal } from "@/components/landing/landing-motion"

const products = [
  { name: "ESP32 Development Board", category: "MIKROKONTROLER", price: "Rp 68.000", image: "/images/product-esp32.jpg" },
  { name: "SG90 Micro Servo Motor", category: "AKTUATOR", price: "Rp 18.000", image: "/images/product-sg90.jpg" },
  { name: "HC-SR04 Ultrasonic Sensor", category: "SENSOR JARAK", price: "Rp 16.500", image: "/images/product-ultrasonic.jpg" },
]

export function FeaturedProducts() {
  return (
    <section className="featured-products-section" id="products">
      <div className="site-container">
        <ScrollReveal className="featured-products-heading">
          <div>
            <span className="section-kicker">KATALOG KOMPONEN MIKROIM</span>
            <h2>Siapkan Komponen untuk Proyekmu</h2>
            <p>Board, sensor, dan aktuator pilihan untuk belajar, membuat prototipe, dan mengembangkan sistem IoT.</p>
          </div>
          <Link className="featured-products-link" href="/products">LIHAT SEMUA PRODUK <ArrowRight aria-hidden="true" /></Link>
        </ScrollReveal>

        <div className="featured-products-grid">
          {products.map((product, index) => (
            <ScrollReveal key={product.name} delay={index * 0.08}>
              <article className="featured-product-card">
                <Link className="featured-product-image" href="/products" aria-label={`Lihat ${product.name}`}>
                  <Image src={product.image} alt={product.name} width={512} height={279} sizes="(max-width: 760px) 100vw, 33vw" />
                  <span className="featured-product-category">{product.category}</span>
                  <span className="featured-product-stock"><i /> READY STOCK</span>
                </Link>
                <div className="featured-product-info">
                  <h3><Link href="/products">{product.name}</Link></h3>
                  <div className="featured-product-bottom">
                    <div><span>HARGA</span><strong>{product.price}</strong></div>
                    <Link className="featured-product-buy" href="/products"><ShoppingBag aria-hidden="true" /> BELI</Link>
                  </div>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
