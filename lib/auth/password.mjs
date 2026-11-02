// Hash password admin dengan scrypt (bawaan Node, tanpa paket tambahan).
// Dipakai bersama oleh aplikasi (TypeScript) dan skrip CLI (scripts/*.mjs) agar formatnya selalu sama.
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto"

const N = 16384
const R = 8
const P = 1
const KEY_LENGTH = 64

/** @param {string} password @param {Buffer} salt @param {number} n @param {number} r @param {number} p @returns {Promise<Buffer>} */
function derive(password, salt, n, r, p) {
  return new Promise((resolve, reject) => {
    scrypt(password.normalize("NFKC"), salt, KEY_LENGTH, { N: n, r, p, maxmem: 64 * 1024 * 1024 }, (error, key) => {
      if (error) reject(error)
      else resolve(key)
    })
  })
}

/** Format: scrypt:N:r:p:saltBase64:hashBase64 @param {string} password @returns {Promise<string>} */
export async function hashPassword(password) {
  const salt = randomBytes(16)
  const key = await derive(password, salt, N, R, P)
  return ["scrypt", N, R, P, salt.toString("base64"), key.toString("base64")].join(":")
}

/** @param {string} password @param {string | null | undefined} stored @returns {Promise<boolean>} */
export async function verifyPassword(password, stored) {
  if (!stored) return false
  const parts = stored.split(":")
  if (parts.length !== 6 || parts[0] !== "scrypt") return false
  const [, n, r, p, saltB64, hashB64] = parts
  const expected = Buffer.from(hashB64, "base64")
  const actual = await derive(password, Buffer.from(saltB64, "base64"), Number(n), Number(r), Number(p))
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}
