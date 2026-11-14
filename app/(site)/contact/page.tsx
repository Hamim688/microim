import type { Metadata } from "next"
import { Mail, MapPin, MessageCircle } from "lucide-react"
import { SubpageHead } from "@/components/layout/subpage-head"
import { SocialIcon } from "@/components/icons/social-icon"
import { LandingMotion, PageEntrance } from "@/components/landing/landing-motion"
import { InquiryForm } from "@/components/contact/inquiry-form"
import { siteContact, siteSocials, whatsappLink } from "@/lib/site"

export const metadata: Metadata = {
  title: "Kontak",
  description: "Ajukan proyek atau tanyakan komponen ke Microim. Pengajuan langsung terkirim lewat WhatsApp.",
}

/**
 * Halaman pengajuan: judul besar, formulir di kiri, dan pratinjau pesan WhatsApp + rincian kontak di kanan
 * (pratinjau menempel saat halaman digulir). Rincian kontak memakai gaya yang sama dengan section Kontak di Beranda.
 */
export default function ContactPage() {
  return (
    <LandingMotion>
      <section className="subpage" aria-labelledby="contact-page-title">
        <div className="site-container">
          <PageEntrance>
            <SubpageHead id="contact-page-title" backTo="/#contact" title="Ajukan Proyekmu," accent="Kami Susun Pesannya.">
              Tugas praktikum, tugas akhir, atau proyek pribadi: isi formulirnya, pesanmu tersusun rapi dan langsung terbuka di WhatsApp tim Microim.
            </SubpageHead>

            <InquiryForm>
              <ul className="kontak-details contact-details">
                <li>
                  <MessageCircle aria-hidden="true" />
                  <span>WhatsApp</span>
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">{siteContact.whatsappDisplay}</a>
                </li>
                <li>
                  <Mail aria-hidden="true" />
                  <span>Email</span>
                  <a href={`mailto:${siteContact.email}`}>{siteContact.email}</a>
                </li>
                {siteSocials.map((social) => (
                  <li key={social.name}>
                    <SocialIcon name={social.name} />
                    <span>{social.name}</span>
                    <a href={social.url} target="_blank" rel="noopener noreferrer">{social.handle}</a>
                  </li>
                ))}
                <li>
                  <MapPin aria-hidden="true" />
                  <span>Lokasi</span>
                  <p>{siteContact.location}</p>
                </li>
              </ul>
            </InquiryForm>
          </PageEntrance>
        </div>
      </section>
    </LandingMotion>
  )
}
