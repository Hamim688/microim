import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { WhatsappFloat } from "@/components/layout/whatsapp-float"
import { PageTracker } from "@/components/analytics/page-tracker"

// Kerangka situs publik (navbar, footer, tombol WA). Area /admin memakai kerangka sendiri.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsappFloat />
      <PageTracker />
    </>
  )
}
