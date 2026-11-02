import { readdir } from "node:fs/promises"
import path from "node:path"
import { db } from "@/lib/db"

/** Daftar nama kategori untuk pilihan di formulir produk. */
export async function categoryNames() {
  const categories = await db.category.findMany({ orderBy: { name: "asc" }, select: { name: true } })
  return categories.map((c) => c.name)
}

/** Gambar yang tersedia di public/images, untuk saran isian foto produk. */
export async function productImages() {
  try {
    const files = await readdir(path.join(process.cwd(), "public", "images"))
    return files.filter((f) => /\.(jpe?g|png|webp)$/i.test(f) && f.startsWith("product-")).sort().map((f) => `/images/${f}`)
  } catch {
    return []
  }
}
