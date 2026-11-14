import type { Metadata } from "next"
import { SubpageHead } from "@/components/layout/subpage-head"
import { LandingMotion, PageEntrance } from "@/components/landing/landing-motion"
import { ProjectIndex } from "@/components/projects/project-index"
import { ProjectDrawing } from "@/components/landing/project-drawings"
import { RevealFlag } from "@/components/landing/reveal-flag"
import { projectIdeas } from "@/lib/projects"

export const metadata: Metadata = {
  title: "Proyek",
  description: "Ide proyek robotika dan IoT (smart car, line follower, lengan robot, smart home, dan lainnya) beserta komponen yang dibutuhkan. Konsultasikan perakitannya bersama Microim.",
}

/** Halaman Proyek: indeks ide proyek di atas latar cetak biru (senada section Proyek di Beranda). */
export default function ProjectsPage() {
  return (
    <LandingMotion>
      <section className="subpage is-blueprint" aria-labelledby="projects-page-title">
        <div className="site-container">
          <PageEntrance>
            <SubpageHead
              id="projects-page-title"
              backTo="/#projects"
              title="Ide Proyek,"
              accent="Lengkap dengan Komponennya."
              aside={<RevealFlag className="subpage-art" amount={0.2}><ProjectDrawing slug="ideas" /></RevealFlag>}
            >
              Ide proyek robotika dan IoT untuk praktikum, tugas akhir, atau belajar sendiri. Sebagian komponennya belum ada di katalog kami, jadi tanyakan dulu ketersediaannya lewat WhatsApp.
            </SubpageHead>
            <ProjectIndex projects={projectIdeas} />
          </PageEntrance>
        </div>
      </section>
    </LandingMotion>
  )
}
