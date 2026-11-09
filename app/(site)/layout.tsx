import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { WhatsappFloat } from "@/components/layout/whatsapp-float"
import { PageTracker } from "@/components/analytics/page-tracker"

// Kerangka situs publik (navbar, footer, tombol WA). Area /admin memakai kerangka sendiri.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Untuk pengguna keyboard/pembaca layar: langsung lompat melewati navbar. */}
      <a href="#konten" className="skip-link">Lewati ke konten</a>
      <Navbar />
      <main id="konten" tabIndex={-1} className="flex-1">{children}</main>
      <Footer />
      <WhatsappFloat />
      <PageTracker />
    </>
  )
}
