import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, LayoutDashboard, ShoppingBag, FolderGit2, Inbox, Users, ShieldAlert } from "lucide-react"

const stats = [
  { label: "Total Pengajuan", count: "12", icon: Inbox, change: "+3 baru" },
  { label: "Proyek Berjalan", count: "5", icon: FolderGit2, change: "Sesuai rencana" },
  { label: "Komponen Terdaftar", count: "48", icon: ShoppingBag, change: "Tersedia" },
  { label: "Pengajuan Klien", count: "24", icon: Users, change: "Aktif" },
]

const recentInquiries = [
  { name: "PT Agro Makmur", type: "Telemetri IoT", budget: "Rp 15.000.000", status: "BARU", date: "Hari ini" },
  { name: "Lab Robotika Kampus", type: "Papan Penggerak Kustom", budget: "Rp 6.000.000", status: "DITINJAU", date: "Kemarin" },
  { name: "CV Smart Logistic", type: "Perangkat Lunak AGV", budget: "Rp 25.000.000", status: "PENAWARAN", date: "2 hari lalu" },
]

export default function AdminPage() {
  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-[#FFC928] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Situs Utama
        </Link>
        <span className="flex items-center gap-1.5 text-xs font-mono text-[#FFC928] bg-[#FFC928]/10 px-3 py-1 rounded-full border border-[#FFC928]/20">
          <ShieldAlert className="w-3.5 h-3.5" />
          Pratinjau Portal Admin (Tahap 10)
        </span>
      </div>

      <div className="space-y-3 mb-10">
        <Badge variant="gold">Panel Manajemen</Badge>
        <h1 className="text-3xl font-extrabold text-white">Pusat Kendali MikroIm</h1>
        <p className="text-slate-400 text-sm">
          Kelola katalog komponen IoT, pantau pengajuan proyek kustom, dan status pengerjaan perangkat keras.
        </p>
      </div>

      {/* Ringkasan statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((s, idx) => {
          const Icon = s.icon
          return (
            <div key={idx} className="p-6 rounded-2xl bg-[#0c213d] border border-[#173359]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-slate-400">{s.label}</span>
                <div className="w-9 h-9 rounded-xl bg-[#173359] text-[#FFC928] flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{s.count}</p>
              <span className="text-xs text-emerald-400 font-mono">{s.change}</span>
            </div>
          )
        })}
      </div>

      {/* Daftar pengajuan terbaru */}
      <div className="rounded-2xl bg-[#0c213d] border border-[#173359] p-6">
        <h3 className="text-lg font-bold text-white mb-4">Daftar Pengajuan Proyek Terbaru</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#173359] text-xs uppercase text-slate-400 font-mono">
              <tr>
                <th className="pb-3">Klien</th>
                <th className="pb-3">Tipe Proyek</th>
                <th className="pb-3">Anggaran</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#173359]/60">
              {recentInquiries.map((inq, i) => (
                <tr key={i} className="hover:bg-white/[0.02]">
                  <td className="py-4 font-semibold text-white">{inq.name}</td>
                  <td className="py-4 text-slate-300">{inq.type}</td>
                  <td className="py-4 font-mono text-slate-300">{inq.budget}</td>
                  <td className="py-4">
                    <span
                      className={`text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md ${
                        inq.status === "BARU"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : inq.status === "DITINJAU"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}
                    >
                      {inq.status}
                    </span>
                  </td>
                  <td className="py-4 text-xs text-slate-400">{inq.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
