import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Cpu, ArrowUpRight } from "lucide-react"

const projects = [
  {
    title: "Telemetri Kualitas Air & Oksigen Terlarut",
    category: "IoT",
    desc: "Sistem pemantauan tambak melalui LoRaWAN jarak jauh dengan baterai panel surya yang bertahan hingga 14 hari.",
    tech: ["ESP32", "LoRaWAN", "FreeRTOS", "MQTT"],
  },
  {
    title: "Kendaraan Logistik Otomatis & Penghindar Rintangan",
    category: "Robotika",
    desc: "Robot pengangkut barang di gudang dengan sensor ultrasonik dan LiDAR berbasis mikrokontroler presisi tinggi.",
    tech: ["STM32", "Pengendali H-Bridge", "Pengendali PID", "BLE 5.0"],
  },
  {
    title: "Pencatat Suhu Rantai Dingin",
    category: "Sistem Tertanam",
    desc: "Pencatat data berakurasi tinggi dengan enkripsi memori internal dan sinkronisasi NFC ke ponsel pintar.",
    tech: ["ATmega328P", "DS18B20", "EEPROM", "NFC"],
  },
]

export default function ProjectsPage() {
  return (
    <div className="py-12 sm:py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-[#FFC928] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </div>

      <div className="space-y-4 max-w-3xl mb-14">
        <Badge variant="gold">Portofolio Teknologi</Badge>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          Proyek Rekayasa &amp; Purwarupa
        </h1>
        <p className="text-lg text-slate-300">
          Penerapan nyata solusi perangkat keras, perangkat lunak mikrokontroler, dan sistem otomasi terintegrasi.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {projects.map((p, i) => (
          <div
            key={i}
            className="rounded-2xl bg-[#0c213d] border border-[#173359] p-5 sm:p-6 flex flex-col justify-between hover:border-[#FFC928]/50 transition-all"
          >
            <div>
              <span className="text-xs font-mono text-[#FFC928] bg-[#FFC928]/10 px-2.5 py-0.5 rounded border border-[#FFC928]/20">
                {p.category}
              </span>
              <h3 className="text-xl font-bold text-white mt-4 mb-2">{p.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">{p.desc}</p>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {p.tech.map((t, tidx) => (
                  <span
                    key={tidx}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#071426] text-slate-300 border border-[#173359]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <Link href="/contact">
              <Button variant="secondary" size="sm" className="w-full flex items-center justify-center gap-1.5">
                Konsultasikan Proyek Serupa
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
