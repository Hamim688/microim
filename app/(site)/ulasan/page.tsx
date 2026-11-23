import type { Metadata } from "next"
import { pageMetadata } from "@/lib/metadata"
import { SubpageHead } from "@/components/layout/subpage-head"
import { LandingMotion, PageEntrance } from "@/components/landing/landing-motion"
import { PublicReviewForm } from "@/components/reviews/public-review-form"
import { submitPublicReview } from "./actions"

export const metadata: Metadata = pageMetadata({
  title: "Tulis Ulasan",
  description: "Bagikan pengalamanmu belanja komponen mikrokontroler atau menggunakan jasa rakit & pemrograman IoT Microim.",
  path: "/ulasan",
})

/**
 * Halaman formulir ulasan publik (`/ulasan`) yang dapat dibagikan langsung ke pelanggan lewat WhatsApp.
 */
export default function PublicReviewPage() {
  return (
    <LandingMotion>
      <section className="subpage is-form" aria-labelledby="review-page-title">
        <div className="site-container">
          <PageEntrance>
            <SubpageHead id="review-page-title" backTo="/#ulasan" title="Sudah Order?" accent="Bagikan Pengalamanmu.">
              Ceritamu membantu mahasiswa dan perakit lain lebih yakin saat memilih komponen atau jasa rakit di Microim.
            </SubpageHead>

            <PublicReviewForm action={submitPublicReview} />
          </PageEntrance>
        </div>
      </section>
    </LandingMotion>
  )
}
