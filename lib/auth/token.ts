// Token sesi admin: payload JSON (base64url) + tanda tangan HMAC-SHA256 dengan AUTH_SECRET.
// Tidak bergantung pada next/headers sehingga bisa dipakai di proxy.ts maupun di server.
import { createHmac, timingSafeEqual } from "node:crypto"

export const SESSION_COOKIE = "microim_admin"
/** "Ingat saya" dicentang: tetap masuk 30 hari. */
export const SESSION_TTL_REMEMBER = 60 * 60 * 24 * 30
/** Tanpa "Ingat saya": sesi berakhir saat browser ditutup, paling lama 12 jam. */
export const SESSION_TTL_SHORT = 60 * 60 * 12

export type SessionPayload = { uid: string; exp: number }

export function getAuthSecret(): string | null {
  const secret = process.env.AUTH_SECRET?.trim() ?? ""
  // Tolak nilai contoh bawaan template dan rahasia yang terlalu pendek.
  if (secret.length < 32 || secret.startsWith("change-this")) return null
  return secret
}

function sign(data: string, secret: string) {
  return createHmac("sha256", secret).update(data).digest("base64url")
}

export function createSessionToken(uid: string, secret: string, ttlSeconds: number): string {
  const payload: SessionPayload = { uid, exp: Math.floor(Date.now() / 1000) + ttlSeconds }
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url")
  return `${data}.${sign(data, secret)}`
}

export function verifySessionToken(token: string | undefined | null): SessionPayload | null {
  const secret = getAuthSecret()
  if (!token || !secret) return null
  const [data, signature] = token.split(".")
  if (!data || !signature) return null
  const expected = Buffer.from(sign(data, secret))
  const actual = Buffer.from(signature)
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null
  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as SessionPayload
    if (typeof payload.uid !== "string" || typeof payload.exp !== "number") return null
    if (payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}
