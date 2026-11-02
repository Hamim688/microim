// Pemeriksaan awal (optimistik) untuk area admin: tanpa sesi valid -> ke /admin/login.
// Pengecekan sebenarnya tetap dilakukan di server lewat requireAdmin() pada setiap halaman & aksi.
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/token"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const loggedIn = Boolean(verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value))
  // Halaman login selalu boleh dibuka; ia sendiri yang mengalihkan admin yang sudah masuk.
  if (pathname === "/admin/login") return NextResponse.next()
  if (!loggedIn) return NextResponse.redirect(new URL("/admin/login", request.url))
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
}
