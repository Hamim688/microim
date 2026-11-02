"use server"

import { redirect } from "next/navigation"
import * as z from "zod"
import { db } from "@/lib/db"
import { hashPassword, verifyPassword } from "@/lib/auth/password.mjs"
import { endSession, requireAdmin, startSession } from "@/lib/auth/session"
import { getAuthSecret } from "@/lib/auth/token"

export type FormState = { error?: string; success?: string } | undefined

const LoginSchema = z.object({
  email: z.email({ error: "Format email tidak valid." }).trim().toLowerCase(),
  password: z.string().min(1, { error: "Password wajib diisi." }),
})

export async function login(_state: FormState, formData: FormData): Promise<FormState> {
  const parsed = LoginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." }
  if (!getAuthSecret()) return { error: "Server belum siap: AUTH_SECRET belum diatur. Hubungi pengelola website." }

  const user = await db.user.findUnique({ where: { email: parsed.data.email } })
  const valid = user?.role === "ADMIN" && (await verifyPassword(parsed.data.password, user.passwordHash))
  if (!user || !valid) {
    // Jeda kecil memperlambat percobaan tebak-tebakan password.
    await new Promise((resolve) => setTimeout(resolve, 700))
    return { error: "Email atau password salah." }
  }

  await startSession(user.id, formData.get("remember") === "on")
  redirect("/admin")
}

export async function logout() {
  await endSession()
  redirect("/admin/login")
}

const PasswordSchema = z
  .object({
    current: z.string().min(1, { error: "Password lama wajib diisi." }),
    next: z.string().min(8, { error: "Password baru minimal 8 karakter." }),
    confirm: z.string(),
  })
  .refine((data) => data.next === data.confirm, { error: "Konfirmasi password baru tidak sama." })

export async function changePassword(_state: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin()
  const parsed = PasswordSchema.safeParse({
    current: formData.get("current"),
    next: formData.get("next"),
    confirm: formData.get("confirm"),
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." }

  const user = await db.user.findUnique({ where: { id: admin.id } })
  if (!user || !(await verifyPassword(parsed.data.current, user.passwordHash))) return { error: "Password lama salah." }

  await db.user.update({ where: { id: admin.id }, data: { passwordHash: await hashPassword(parsed.data.next) } })
  return { success: "Password berhasil diganti." }
}
