export default function AdminLoading() {
  return (
    <div className="admin-page animate-pulse" aria-busy="true" aria-label="Memuat data...">
      <div className="admin-page-head">
        <div>
          <div className="h-8 w-44 rounded-lg bg-white/10 mb-2" />
          <div className="h-4 w-64 rounded bg-white/5" />
        </div>
      </div>

      <div className="admin-kpi-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-[#0c213d]/60 border border-[#173359]/60 p-5">
            <div className="h-4 w-20 rounded bg-white/10 mb-3" />
            <div className="h-8 w-32 rounded bg-white/15" />
          </div>
        ))}
      </div>

      <div className="mt-8 h-80 rounded-2xl bg-[#0c213d]/40 border border-[#173359]/50 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="w-7 h-7 border-2 border-[#FFC928] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono tracking-wider text-slate-300">MEMUAT DATA...</span>
        </div>
      </div>
    </div>
  )
}

