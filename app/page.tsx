import { Hero } from "@/components/landing/hero"
import { AboutSection } from "@/components/landing/about-section"
import { ValuesSection } from "@/components/landing/values-section"
import { ServicesPreview } from "@/components/landing/services-preview"
import { EngineeringEdge } from "@/components/landing/engineering-edge"
import { ProjectShowcase } from "@/components/landing/project-showcase"
import { CTASection } from "@/components/landing/cta-section"

export default function HomePage() {
  return (
    <div className="landing-page">
      <Hero />
      <AboutSection />
      <ValuesSection />
      <ServicesPreview />
      <EngineeringEdge />
      <ProjectShowcase />
      <CTASection />
    </div>
  )
}
