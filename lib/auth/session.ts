// Lapisan akses data untuk sesi admin. Setiap halaman dan aksi admin WAJIB memanggil requireAdmin().
import { cache } from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { SESSION_COOKIE, SESSION_TTL_REMEMBER, SESSION_TTL_SHORT, createSessionToken, getAuthSecret, verifySessionToken } from "@/lib/auth/token"

export const getAdmin = cache(async () => {
  try {
    const token = (await cookies()).get(SESSION_COOKIE)?.value
    const session = verifySessionToken(token)
    if (!session) return null
    const user = await db.user.findUnique({
      where: { id: session.uid },
      select: { id: true, name: true, email: true, role: true },
    })
    if (!user || user.role !== "ADMIN") return null
    return user
  } catch (error) {
    if ((error as { digest?: string })?.digest === "DYNAMIC_SERVER_USAGE") throw error
    console.error("getAdmin error:", error)
    return null
  }
})

export async function requireAdmin() {
  const admin = await getAdmin()
  if (!admin) redirect("/admin/login")
  return admin
}

/** remember = true: cookie bertahan 30 hari. false: cookie sesi (hilang saat browser ditutup), token kedaluwarsa 12 jam. */
export async function startSession(userId: string, remember = false) {
  const secret = getAuthSecret()
  if (!secret) throw new Error("AUTH_SECRET belum diatur dengan benar.")
  const ttl = remember ? SESSION_TTL_REMEMBER : SESSION_TTL_SHORT
  ;(await cookies()).set(SESSION_COOKIE, createSessionToken(userId, secret, ttl), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    ...(remember ? { maxAge: ttl } : {}),
  })
}

export async function endSession() {
  ;(await cookies()).delete(SESSION_COOKIE)
}
