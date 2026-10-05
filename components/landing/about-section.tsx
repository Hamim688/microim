import { Globe2 } from "lucide-react"

export function AboutSection() {
  return (
    <section className="about-section" id="about">
      <div className="site-container">
        <div className="about-intro">
          <span className="section-kicker">THE MIKROIM APPROACH</span>
          <div className="about-intro-row">
            <div>
              <h2>Building Technology Through Innovation</h2>
              <p>MikroIm hadir sebagai penghubung antara ide kreatif dan implementasi teknologi nyata, melalui pengembangan hardware dan software.</p>
            </div>
            <span className="about-side-note"><i /> INNOVATION THROUGH ENGINEERING</span>
          </div>
        </div>
        <div className="vision-panel">
          <div>
            <span className="section-kicker">CORE COMPANY VISION</span>
            <blockquote>“Menjadi perusahaan yang mendorong pengembangan dan pembelajaran Teknologi IT di level global.”</blockquote>
          </div>
          <div className="vision-badge"><Globe2 aria-hidden="true" /><span>GLOBAL<br />DEVELOPMENT</span></div>
          <div className="vision-watermark" aria-hidden="true">M</div>
        </div>
      </div>
    </section>
  )
}
