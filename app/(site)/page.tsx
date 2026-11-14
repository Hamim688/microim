import { Hero } from "@/components/landing/hero"
import { AboutSection } from "@/components/landing/about-section"
import { ValuesSection } from "@/components/landing/values-section"
import { ServicesPreview } from "@/components/landing/services-preview"
import { FeaturedProducts } from "@/components/landing/featured-products"
import { ProjectShowcase } from "@/components/landing/project-showcase"
import { ContactSection } from "@/components/landing/contact-section"
import { TechMarquee } from "@/components/landing/tech-marquee"
import { OrderSteps } from "@/components/landing/order-steps"
import { LandingMotion } from "@/components/landing/landing-motion"
import { PcbDivider } from "@/components/landing/pcb-divider"
import { getFeaturedProducts, getMarqueeNames, getCatalog } from "@/lib/catalog"

// Produk unggulan & pita berjalan memakai stok/harga terbaru dari database.
export const revalidate = 300

export default async function HomePage() {
  const [featured, marquee, catalog] = await Promise.all([getFeaturedProducts(), getMarqueeNames(), getCatalog()])
  return (
    <LandingMotion>
      <div className="landing-page">
        <Hero />
        <TechMarquee names={marquee} />
        <AboutSection />
        <ValuesSection />
        <PcbDivider />
        <ServicesPreview />
        {/* Bab Produk: etalase, lalu cara pesan (latar sama, tanpa garis pemisah). */}
        <FeaturedProducts products={featured} total={catalog.length} />
        <OrderSteps />
        <ProjectShowcase />
        <ContactSection />
      </div>
    </LandingMotion>
  )
}
