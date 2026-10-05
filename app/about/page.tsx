import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Cpu, Globe, Rocket } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-[#FFC928] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </div>

      <div className="space-y-6 max-w-3xl">
        <Badge variant="gold">Tentang Perusahaan</Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Menghubungkan Ide Lewat Rekayasa Cerdas
        </h1>
        <p className="text-lg text-slate-300 leading-relaxed">
          MikroIm adalah entitas rekayasa teknologi dan laboratorium Internet of Things yang berfokus pada integrasi perangkat keras, mikrokontroler terprogram, purwarupa elektronik, dan platform digital.
        </p>
      </div>

      {/* Vision Card */}
      <div className="mt-12 p-8 rounded-2xl bg-[#0c213d] border border-[#173359] max-w-4xl space-y-4">
        <div className="flex items-center gap-3 text-[#FFC928]">
          <Globe className="w-6 h-6" />
          <h2 className="text-xl font-bold text-white">Visi Global MikroIm</h2>
        </div>
        <blockquote className="text-xl font-medium text-slate-200 italic border-l-4 border-[#FFC928] pl-4 py-1">
          &ldquo;Menjadi perusahaan yang mendorong pengembangan dan pembelajaran Teknologi IT di level global.&rdquo;
        </blockquote>
      </div>

      <div className="mt-12 flex gap-4">
        <Link href="/contact">
          <Button size="lg">Hubungi Tim Engineer</Button>
        </Link>
        <Link href="/services">
          <Button variant="secondary" size="lg">Lihat Layanan Kami</Button>
        </Link>
      </div>
    </div>
  )
}
