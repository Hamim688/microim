"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import * as z from "zod"
import { Prisma } from "@prisma/client"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/auth/session"
import { slugify } from "@/lib/admin/format"
import { saveLowStockThreshold } from "@/lib/admin/settings"
import { ImageError, readImage, removeStoredImage, storeImage } from "@/lib/admin/images"

export type ProductFormState = { error?: string; success?: string } | undefined

const ProductSchema = z.object({
  name: z.string().trim().min(2, { error: "Nama produk minimal 2 karakter." }).max(120),
  category: z.string().trim().min(2, { error: "Kategori wajib diisi." }).max(60),
  price: z.coerce.number({ error: "Harga jual harus berupa angka." }).int({ error: "Harga jual harus bilangan bulat." }).min(0).max(100_000_000),
  costPrice: z.coerce.number({ error: "Modal harus berupa angka." }).int({ error: "Modal harus bilangan bulat." }).min(0, { error: "Modal tidak boleh negatif." }).max(100_000_000),
  description: z.string().trim().max(2000).optional(),
})

function readProduct(formData: FormData) {
  return ProductSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    price: formData.get("price"),
    costPrice: formData.get("costPrice") || 0,
    description: formData.get("description") ?? undefined,
  })
}

async function categoryIdFor(name: string, tx: Prisma.TransactionClient) {
  const slug = slugify(name)
  const category = await tx.category.upsert({ where: { slug }, update: {}, create: { name, slug } })
  return category.id
}

async function uniqueSlug(name: string, tx: Prisma.TransactionClient, exceptId?: string) {
  const base = slugify(name)
  let slug = base
  for (let i = 2; ; i++) {
    const existing = await tx.product.findUnique({ where: { slug }, select: { id: true } })
    if (!existing || existing.id === exceptId) return slug
    slug = `${base}-${i}`
  }
}

/** Segarkan panel admin sekaligus halaman publik (katalog, stok, harga di Beranda & Produk). */
function refresh() {
  revalidatePath("/", "layout")
}

export async function createProduct(_state: ProductFormState, formData: FormData): Promise<ProductFormState> {
  await requireAdmin()
  const parsed = readProduct(formData)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }
  const initialStock = z.coerce.number().int().min(0).max(1_000_000).safeParse(formData.get("stock") || 0)
  if (!initialStock.success) return { error: "Stok awal harus bilangan bulat 0 atau lebih." }
  let image: File | null
  try {
    image = readImage(formData)
  } catch (e) {
    return { error: e instanceof ImageError ? e.message : "Foto tidak valid." }
  }

  const product = await db.$transaction(async (tx) => {
    const imageUrl = image ? await storeImage(tx, image) : null
    const created = await tx.product.create({
      data: {
        name: parsed.data.name,
        slug: await uniqueSlug(parsed.data.name, tx),
        description: parsed.data.description ?? "",
        price: parsed.data.price,
        costPrice: parsed.data.costPrice,
        imageUrl,
        stock: initialStock.data,
        categoryId: await categoryIdFor(parsed.data.category, tx),
      },
    })
    if (initialStock.data > 0) {
      await tx.stockMovement.create({
        data: { productId: created.id, type: "INITIAL", change: initialStock.data, stockAfter: initialStock.data, note: "Stok awal" },
      })
    }
    return created
  })

  refresh()
  redirect(`/admin/produk/${product.id}?saved=1`)
}

export async function updateProduct(id: string, _state: ProductFormState, formData: FormData): Promise<ProductFormState> {
  await requireAdmin()
  const parsed = readProduct(formData)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }
  let image: File | null
  try {
    image = readImage(formData)
  } catch (e) {
    return { error: e instanceof ImageError ? e.message : "Foto tidak valid." }
  }
  const removeImage = formData.get("removeImage") === "1"

  await db.$transaction(async (tx) => {
    const current = await tx.product.findUnique({ where: { id }, select: { imageUrl: true } })
    let imageUrl = current?.imageUrl ?? null
    if (image || removeImage) {
      await removeStoredImage(tx, imageUrl)
      imageUrl = image ? await storeImage(tx, image) : null
    }
    await tx.product.update({
      where: { id },
      data: {
        name: parsed.data.name,
        slug: await uniqueSlug(parsed.data.name, tx, id),
        description: parsed.data.description ?? "",
        price: parsed.data.price,
        costPrice: parsed.data.costPrice,
        imageUrl,
        categoryId: await categoryIdFor(parsed.data.category, tx),
      },
    })
  })
  refresh()
  return { success: "Perubahan produk tersimpan." }
}

const StockSchema = z.object({
  mode: z.enum(["restock", "set"]),
  amount: z.coerce.number({ error: "Jumlah harus berupa angka." }).int({ error: "Jumlah harus bilangan bulat." }),
  note: z.string().trim().max(200).optional(),
})

export async function adjustStock(id: string, _state: ProductFormState, formData: FormData): Promise<ProductFormState> {
  await requireAdmin()
  const parsed = StockSchema.safeParse({ mode: formData.get("mode"), amount: formData.get("amount"), note: formData.get("note") ?? undefined })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }
  const { mode, amount, note } = parsed.data
  if (mode === "restock" && amount <= 0) return { error: "Jumlah restock harus lebih dari 0." }
  if (mode === "set" && amount < 0) return { error: "Stok tidak boleh negatif." }

  const message = await db.$transaction(async (tx) => {
    const product = await tx.product.findUnique({ where: { id }, select: { stock: true } })
    if (!product) return "Produk tidak ditemukan."
    const stockAfter = mode === "restock" ? product.stock + amount : amount
    const change = stockAfter - product.stock
    if (change === 0) return "Stok tidak berubah."
    await tx.product.update({ where: { id }, data: { stock: stockAfter } })
    await tx.stockMovement.create({
      data: { productId: id, type: mode === "restock" ? "RESTOCK" : "ADJUSTMENT", change, stockAfter, note: note || null },
    })
    return null
  })
  if (message) return { error: message }
  refresh()
  return { success: mode === "restock" ? `Stok bertambah ${amount}.` : `Stok dikoreksi menjadi ${amount}.` }
}

export async function deleteProduct(id: string) {
  await requireAdmin()
  const sold = await db.orderItem.count({ where: { productId: id } })
  if (sold > 0) redirect(`/admin/produk/${id}?error=terjual`)
  await db.$transaction(async (tx) => {
    const product = await tx.product.delete({ where: { id }, select: { imageUrl: true } })
    await removeStoredImage(tx, product.imageUrl)
  })
  refresh()
  redirect("/admin/produk?deleted=1")
}

export async function setLowStockThreshold(_state: ProductFormState, formData: FormData): Promise<ProductFormState> {
  await requireAdmin()
  const value = z.coerce.number().int().min(0).max(1000).safeParse(formData.get("threshold"))
  if (!value.success) return { error: "Batas harus bilangan bulat 0–1000." }
  await saveLowStockThreshold(value.data)
  refresh()
  return { success: `Stok 1–${value.data} sekarang dianggap menipis.` }
}
