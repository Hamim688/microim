import type { Metadata } from "next"
import { pageMetadata } from "@/lib/metadata"
import { SubpageHead } from "@/components/layout/subpage-head"
import { LandingMotion, PageEntrance } from "@/components/landing/landing-motion"
import { ProductCatalog } from "@/components/products/product-catalog"
import { getCatalog } from "@/lib/catalog"
import { ProductListJsonLd } from "@/components/seo/json-ld"

export const metadata: Metadata = pageMetadata({
  title: "Jual Komponen Arduino, ESP32 & Sensor",
  description: "Jual ESP32, servo SG90, sensor, driver motor, dan kit robot di Semarang. Stok dan harga terbaru, pesan lewat WhatsApp, COD di area kampus.",
  path: "/products",
})

// Halaman dibangun ulang paling lambat tiap 5 menit, dan langsung saat admin mengubah produk/stok.
export const revalidate = 300

export default async function ProductsPage() {
  const products = await getCatalog()
  return (
    <LandingMotion>
      <ProductListJsonLd products={products} />
      <section className="subpage" aria-labelledby="products-page-title">
        <div className="site-container">
          <PageEntrance>
            <SubpageHead id="products-page-title" backTo="/#products" title="Cari Komponennya," accent="Pesan lewat WhatsApp.">
              Papan mikrokontroler, sensor, aktuator, dan aksesori untuk belajar, membuat purwarupa, dan mengembangkan sistem IoT. Harga dan stok mengikuti data terbaru kami.
            </SubpageHead>
            <ProductCatalog products={products} />
          </PageEntrance>
        </div>
      </section>
    </LandingMotion>
  )
}
