import { cookies } from "next/headers"
import { db } from "@/lib/db"

const COOKIE = "mcm_vid"
const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|lighthouse|headless|curl|wget|python|vercel/i

/** Mencatat satu kunjungan halaman situs publik. Dipanggil oleh <PageTracker /> lewat sendBeacon. */
export async function POST(request: Request) {
  const ua = request.headers.get("user-agent") ?? ""
  if (!ua || BOT.test(ua)) return new Response(null, { status: 204 })

  let body: { path?: unknown; referrer?: unknown } = {}
  try {
    body = JSON.parse(await request.text())
  } catch {
    return new Response(null, { status: 204 })
  }
  const path = typeof body.path === "string" ? body.path.slice(0, 200) : ""
  if (!path.startsWith("/") || path.startsWith("/admin") || path.startsWith("/api")) return new Response(null, { status: 204 })

  // Rujukan hanya disimpan nama domainnya, dan hanya bila dari situs lain.
  let referrer: string | null = null
  if (typeof body.referrer === "string" && body.referrer) {
    try {
      const host = new URL(body.referrer).hostname.replace(/^www\./, "")
      const self = new URL(request.url).hostname.replace(/^www\./, "")
      if (host && host !== self) referrer = host.slice(0, 100)
    } catch {}
  }
  const device = /mobi|android|iphone|ipad/i.test(ua) ? "mobile" : "desktop"

  const jar = await cookies()
  let visitorId = jar.get(COOKIE)?.value
  if (!visitorId || !/^[a-f0-9-]{36}$/.test(visitorId)) {
    visitorId = crypto.randomUUID()
    jar.set(COOKIE, visitorId, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 365 })
  }

  try {
    await db.pageView.create({ data: { path, visitorId, referrer, device } })
  } catch (error) {
    console.error("track", error)
  }
  return new Response(null, { status: 204 })
}
