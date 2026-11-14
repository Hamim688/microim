import { AtSign } from "lucide-react"

/**
 * Ikon media sosial bergaya garis, senada ikon lain di situs (lucide tidak lagi menyediakan ikon merek).
 * Warnanya mengikuti `currentColor`, jadi ikut emas di tempat ikon kontak lain berwarna emas.
 * Nama yang tidak dikenal memakai ikon "@".
 */
export function SocialIcon({ name }: { name: string }) {
  const key = name.toLowerCase()
  if (key !== "instagram" && key !== "tiktok") return <AtSign aria-hidden="true" />
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {key === "instagram" ? (
        <>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.4" cy="6.6" r=".9" fill="currentColor" stroke="none" />
        </>
      ) : (
        <path d="M9 12a4 4 0 1 0 4 4V3a5 5 0 0 0 5 5" />
      )}
    </svg>
  )
}
