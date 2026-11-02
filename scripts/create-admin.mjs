// Buat atau perbarui satu akun admin.
// Pakai: npm run admin:create -- email@contoh.com "password-minimal-8"
import "./env.mjs"
import pkg from "@prisma/client"
import { hashPassword } from "../lib/auth/password.mjs"

const [email, password, ...nameParts] = process.argv.slice(2)
if (!email || !password || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8) {
  console.error('Pakai: npm run admin:create -- email@contoh.com "password-minimal-8" [Nama]')
  process.exit(1)
}

const { PrismaClient } = pkg
const db = new PrismaClient()
const passwordHash = await hashPassword(password)
const name = nameParts.join(" ") || "Admin Microim"
const user = await db.user.upsert({
  where: { email: email.toLowerCase() },
  update: { passwordHash, role: "ADMIN" },
  create: { email: email.toLowerCase(), name, passwordHash, role: "ADMIN" },
})
console.log(`Akun admin siap: ${user.email}`)
await db.$disconnect()
