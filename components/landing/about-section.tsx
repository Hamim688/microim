import { Globe2 } from "lucide-react"

export function AboutSection() {
  return (
    <section className="about-section" id="about">
      <div className="site-container">
        <div className="about-intro">
          <span className="section-kicker">CARA KERJA MIKROIM</span>
          <div className="about-intro-row">
            <div>
              <h2>Membangun Teknologi Lewat Inovasi</h2>
              <p>MikroIm menghubungkan ide kreatif dengan penerapan nyata melalui pengembangan perangkat keras dan perangkat lunak.</p>
            </div>
            <span className="about-side-note"><i /> INOVASI MELALUI REKAYASA</span>
          </div>
        </div>
        <div className="vision-panel">
          <div>
            <span className="section-kicker">VISI UTAMA PERUSAHAAN</span>
            <blockquote>“Menjadi perusahaan yang mendorong pengembangan dan pembelajaran Teknologi IT di level global.”</blockquote>
          </div>
          <div className="vision-badge"><Globe2 aria-hidden="true" /><span>PENGEMBANGAN<br />MENDUNIA</span></div>
          <div className="vision-watermark" aria-hidden="true">M</div>
        </div>
      </div>
    </section>
  )
}
