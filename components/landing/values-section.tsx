import { BrainCircuit, Check, Gauge, Lightbulb, Link2, Sparkles, UsersRound, Zap } from "lucide-react"

const values = [
  { letter: "M", title: "Mutu", text: "Memberikan solusi teknologi dengan kualitas yang terukur.", icon: Check },
  { letter: "I", title: "Inovatif", text: "Mengembangkan teknologi kreatif untuk kebutuhan masa depan.", icon: Lightbulb },
  { letter: "C", title: "Cerdas", text: "Menghubungkan perangkat dan sistem melalui rancangan yang tepat.", icon: BrainCircuit },
  { letter: "R", title: "Responsif", text: "Memahami kebutuhan pengguna dalam setiap proses rekayasa.", icon: Zap },
  { letter: "O", title: "Optimal", text: "Memilih solusi yang sesuai untuk tujuan dan batasan proyek.", icon: Gauge },
  { letter: "I", title: "Integratif", text: "Menyatukan hardware, firmware, aplikasi, dan konektivitas.", icon: Link2 },
  { letter: "M", title: "Mudah", text: "Membuat teknologi kompleks terasa lebih mudah digunakan.", icon: UsersRound },
]

export function ValuesSection() {
  return (
    <section className="values-section" aria-labelledby="values-heading">
      <div className="site-container">
        <div className="values-heading-row">
          <h2 id="values-heading"><span>M-I-C-R-O-I-M</span> Corporate Values</h2>
          <span className="section-code">[SYS.VAL.7NODES]</span>
        </div>
        <div className="values-grid">
          {values.map(({ letter, title, text, icon: Icon }, index) => (
            <article className={`value-card${index === 6 ? " value-card-wide" : ""}`} key={`${letter}-${title}`}>
              <div className="value-card-top"><span className="value-letter">{letter}</span><Icon aria-hidden="true" /></div>
              <h3>{title}</h3>
              <p>{text}</p>
              <div className="value-card-meta"><span>MIKROIM / 0{index + 1}</span><Sparkles aria-hidden="true" /></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
