import { db } from "@/lib/db"

/** Menyajikan foto produk yang diunggah lewat panel admin. URL berisi id unik, jadi aman di-cache selamanya. */
export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params
  const id = file.replace(/\.\w+$/, "")
  if (!/^[a-z0-9]+$/i.test(id)) return new Response("Tidak ditemukan", { status: 404 })
  const image = await db.productImage.findUnique({ where: { id }, select: { data: true, mimeType: true } })
  if (!image) return new Response("Tidak ditemukan", { status: 404 })
  return new Response(new Uint8Array(image.data), {
    headers: {
      "Content-Type": image.mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  })
}
