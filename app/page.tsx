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

export default function HomePage() {
  return (
    <LandingMotion>
      <div className="landing-page">
        <Hero />
        <TechMarquee />
        <AboutSection />
        <ValuesSection />
        <ServicesPreview />
        <FeaturedProducts />
        <OrderSteps />
        <EngineeringEdge />
        <ProjectShowcase />
        <SocialSection />
        <CTASection />
      </div>
    </LandingMotion>
  )
}
