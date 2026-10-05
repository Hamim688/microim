import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Cpu, Terminal, Smartphone, Wrench, CheckCircle2 } from "lucide-react"

export default function ServicesPage() {
  return (
    <div className="py-12 sm:py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-[#FFC928] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </div>

      <div className="space-y-4 max-w-3xl mb-10 sm:mb-16">
        <Badge variant="gold">Layanan Rekayasa</Badge>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          Jasa Perakitan Perangkat &amp; Pemrograman Sistem Tertanam
        </h1>
        <p className="text-lg text-slate-300">
          Dari perakitan purwarupa hingga sistem tertanam yang siap diproduksi.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="p-5 sm:p-8 rounded-2xl bg-[#0c213d] border border-[#173359] flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#173359] flex items-center justify-center text-[#FFC928] mb-6">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Perakitan Perangkat &amp; IoT</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Perancangan skematik, tata letak PCB khusus, pemilihan sensor dan aktuator, serta integrasi modul nirkabel (LoRa, ESP32, GSM/seluler).
            </p>
          </div>
          <Link href="/contact">
            <Button variant="outline" className="w-full">Ajukan Kebutuhan</Button>
          </Link>
        </div>

        <div className="p-5 sm:p-8 rounded-2xl bg-[#0c213d] border border-[#173359] flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#173359] flex items-center justify-center text-[#FFC928] mb-6">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Pemrograman Sistem Tertanam</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Pengembangan perangkat lunak tertanam C/C++ yang deterministik dengan FreeRTOS, penghematan daya baterai, dan pembaruan jarak jauh yang aman.
            </p>
          </div>
          <Link href="/contact">
            <Button variant="outline" className="w-full">Ajukan Kebutuhan</Button>
          </Link>
        </div>

        <div className="p-5 sm:p-8 rounded-2xl bg-[#0c213d] border border-[#173359] flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#173359] flex items-center justify-center text-[#FFC928] mb-6">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Pembuatan Aplikasi Seluler</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Aplikasi lintas platform untuk menerima telemetri sensor melalui Bluetooth hemat energi (BLE), REST API, atau MQTT WebSocket.
            </p>
          </div>
          <Link href="/contact">
            <Button variant="outline" className="w-full">Ajukan Kebutuhan</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
