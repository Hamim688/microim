import { Hero } from "@/components/landing/hero"
import { AboutSection } from "@/components/landing/about-section"
import { ValuesSection } from "@/components/landing/values-section"
import { ServicesPreview } from "@/components/landing/services-preview"
import { FeaturedProducts } from "@/components/landing/featured-products"
import { EngineeringEdge } from "@/components/landing/engineering-edge"
import { ProjectShowcase } from "@/components/landing/project-showcase"
import { CTASection } from "@/components/landing/cta-section"
import { LandingMotion, PageEntrance, ScrollReveal } from "@/components/landing/landing-motion"

export default function HomePage() {
  return (
    <LandingMotion>
      <div className="landing-page">
        <PageEntrance><Hero /></PageEntrance>
        <ScrollReveal><AboutSection /></ScrollReveal>
        <ScrollReveal><ValuesSection /></ScrollReveal>
        <ServicesPreview />
        <FeaturedProducts />
        <ScrollReveal><EngineeringEdge /></ScrollReveal>
        <ScrollReveal><ProjectShowcase /></ScrollReveal>
        <ScrollReveal><CTASection /></ScrollReveal>
      </div>
    </LandingMotion>
  )
}
