import { Hero } from "@/components/landing/hero"
import { AboutSection } from "@/components/landing/about-section"
import { ValuesSection } from "@/components/landing/values-section"
import { ServicesPreview } from "@/components/landing/services-preview"
import { FeaturedProducts } from "@/components/landing/featured-products"
import { EngineeringEdge } from "@/components/landing/engineering-edge"
import { ProjectShowcase } from "@/components/landing/project-showcase"
import { CTASection } from "@/components/landing/cta-section"
import { TechMarquee } from "@/components/landing/tech-marquee"
import { OrderSteps } from "@/components/landing/order-steps"
import { SocialSection } from "@/components/landing/social-section"
import { LandingMotion } from "@/components/landing/landing-motion"
import { SectionDivider } from "@/components/landing/section-divider"
import { PcbDivider } from "@/components/landing/pcb-divider"
import { getFeaturedProducts, getMarqueeNames } from "@/lib/catalog"

// Produk unggulan & pita berjalan memakai stok/harga terbaru dari database.
export const revalidate = 300

export default async function HomePage() {
  const [featured, marquee] = await Promise.all([getFeaturedProducts(), getMarqueeNames()])
  return (
    <LandingMotion>
      <div className="landing-page">
        <Hero />
        <TechMarquee names={marquee} />
        <AboutSection />
        <ValuesSection />
        <PcbDivider />
        <ServicesPreview />
        <FeaturedProducts products={featured} />
        <SectionDivider />
        <OrderSteps />
        <SectionDivider />
        <EngineeringEdge />
        <SectionDivider />
        <ProjectShowcase />
        <SectionDivider />
        <SocialSection />
        <CTASection />
      </div>
    </LandingMotion>
  )
}
