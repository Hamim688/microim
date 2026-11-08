import type { Prisma } from "@prisma/client"

export const MEDIA_PREFIX = "/media/produk/"
const ALLOWED = new Map([
  ["image/webp", "webp"],
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
])
const MAX_BYTES = 3 * 1024 * 1024

export class ImageError extends Error {}

/** Ambil file "image" dari form (kosong = tidak ada unggahan baru). */
export function readImage(formData: FormData) {
  const file = formData.get("image")
  if (!(file instanceof File) || file.size === 0) return null
  if (!ALLOWED.has(file.type)) throw new ImageError("Format foto harus WebP, JPG, atau PNG.")
  if (file.size > MAX_BYTES) throw new ImageError("Foto terlalu besar (maksimal 3 MB).")
  return file
}

/** Simpan foto ke database dan kembalikan URL publiknya. */
export async function storeImage(tx: Prisma.TransactionClient, file: File) {
  const data = new Uint8Array(await file.arrayBuffer())
  const image = await tx.productImage.create({ data: { data, mimeType: file.type, size: file.size } })
  return `${MEDIA_PREFIX}${image.id}.${ALLOWED.get(file.type)}`
}

/** Hapus foto lama bila foto itu hasil unggahan (bukan foto bawaan di /images). */
export async function removeStoredImage(tx: Prisma.TransactionClient, url: string | null | undefined) {
  if (!url?.startsWith(MEDIA_PREFIX)) return
  const id = url.slice(MEDIA_PREFIX.length).replace(/\.\w+$/, "")
  await tx.productImage.deleteMany({ where: { id } })
}
