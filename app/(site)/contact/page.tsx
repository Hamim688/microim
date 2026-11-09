import type { Metadata } from "next"
import { Clock, Mail, MapPin, MessageSquare } from "lucide-react"
import { PageHero } from "@/components/layout/page-hero"
import { LandingMotion, PageEntrance } from "@/components/landing/landing-motion"
import { InquiryForm } from "@/components/contact/inquiry-form"
import { siteContact, whatsappLink } from "@/lib/site"

export const metadata: Metadata = {
  title: "Kontak",
  description: "Ajukan proyek atau tanyakan komponen ke Microim. Pengajuan langsung terkirim lewat WhatsApp.",
}

export default function ContactPage() {
  return (
    <LandingMotion>
      <PageHero kicker="PENGAJUAN PROYEK & KONSULTASI" title={<>Ceritakan Ide <span>Perangkatmu</span></>}>
        Tugas praktikum, tugas akhir, atau proyek pribadi: isi formulir di bawah, pesanmu langsung tersusun rapi di WhatsApp tim Microim.
      </PageHero>

      <div className="site-container page-body">
        <PageEntrance>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <aside className="lg:col-span-5 space-y-6">
              <div className="p-5 sm:p-6 rounded-[6px] bg-[#0c213d] border border-[#173359] space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-white">Hubungi Kami</h2>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-slate-300 hover:text-[#FFC928] transition-colors">
                  <MessageSquare className="w-4 h-4 text-[#FFC928] shrink-0" aria-hidden="true" />
                  WhatsApp: {siteContact.whatsappDisplay}
                </a>
                <a href={`mailto:${siteContact.email}`} className="flex items-center gap-3 text-sm text-slate-300 hover:text-[#FFC928] transition-colors">
                  <Mail className="w-4 h-4 text-[#FFC928] shrink-0" aria-hidden="true" />
                  {siteContact.email}
                </a>
                <p className="flex items-start gap-3 text-sm text-slate-300">
                  <MapPin className="w-4 h-4 text-[#FFC928] shrink-0 mt-0.5" aria-hidden="true" />
                  {siteContact.location}
                </p>
                <p className="flex items-start gap-3 text-sm text-slate-300">
                  <Clock className="w-4 h-4 text-[#FFC928] shrink-0 mt-0.5" aria-hidden="true" />
                  Pesan WhatsApp dibalas secepatnya; komponen ready stock bisa COD di hari yang sama.
                </p>
              </div>
            </aside>

            <div className="lg:col-span-7">
              <InquiryForm />
            </div>
          </div>
        </PageEntrance>
      </div>
    </LandingMotion>
  )
}
