import { Hero } from "@/components/landing/hero"
import { AboutSection } from "@/components/landing/about-section"
import { ValuesSection } from "@/components/landing/values-section"
import { ServicesPreview } from "@/components/landing/services-preview"
import { FeaturedProducts } from "@/components/landing/featured-products"
import { EngineeringEdge } from "@/components/landing/engineering-edge"
import { ProjectShowcase } from "@/components/landing/project-showcase"
import { CTASection } from "@/components/landing/cta-section"
import { LandingMotion, PageEntrance } from "@/components/landing/landing-motion"

export default function HomePage() {
  return (
    <LandingMotion>
      <div className="landing-page">
        <PageEntrance><Hero /></PageEntrance>
        <AboutSection />
        <ValuesSection />
        <ServicesPreview />
        <FeaturedProducts />
        <EngineeringEdge />
        <ProjectShowcase />
        <CTASection />
      </div>
    </LandingMotion>
  )
}
