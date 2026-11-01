import type { Metadata } from "next"
import { PageHero } from "@/components/layout/page-hero"
import { LandingMotion, PageEntrance } from "@/components/landing/landing-motion"
import { ProductCatalog } from "@/components/products/product-catalog"
import { products } from "@/lib/products"


export const metadata: Metadata = {
  title: "Produk",
  description: "Katalog komponen mikrokontroler, sensor, aktuator, dan aksesori elektronik Microim. Pesan langsung lewat WhatsApp.",
}

export default function ProductsPage() {
  return (
    <LandingMotion>
      <PageHero kicker="KATALOG KOMPONEN IOT" title={<>Komponen Elektronika &amp; <span>Mikrokontroler</span></>}>
        Papan mikrokontroler, sensor, aktuator, dan aksesori untuk belajar, membuat purwarupa, dan mengembangkan sistem IoT. Klik Pesan untuk order lewat WhatsApp.
      </PageHero>
      <div className="site-container page-body">
        <PageEntrance>
          <ProductCatalog products={products} />
        </PageEntrance>
      </div>
    </LandingMotion>
  )
}
