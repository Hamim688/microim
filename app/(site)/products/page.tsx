import type { Metadata } from "next"
import { SubpageHead } from "@/components/layout/subpage-head"
import { LandingMotion, PageEntrance } from "@/components/landing/landing-motion"
import { ProductCatalog } from "@/components/products/product-catalog"
import { getCatalog } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Produk",
  description: "Katalog komponen mikrokontroler, sensor, aktuator, dan aksesori elektronik Microim. Pesan langsung lewat WhatsApp.",
}

// Halaman dibangun ulang paling lambat tiap 5 menit, dan langsung saat admin mengubah produk/stok.
export const revalidate = 300

export default async function ProductsPage() {
  const products = await getCatalog()
  return (
    <LandingMotion>
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
