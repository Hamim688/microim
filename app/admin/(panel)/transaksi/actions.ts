"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import * as z from "zod"
import { Prisma, type OrderStatus } from "@prisma/client"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/auth/session"
import { fromDateInputWIB, orderStatusLabel, toDateInputWIB } from "@/lib/admin/format"
import { StockError, applyStockChanges, diffUsage, usage } from "@/lib/admin/stock"

export type OrderFormState = { error?: string } | undefined

const STATUSES = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"] as const

const ItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().min(1, { error: "Jumlah minimal 1." }).max(100_000),
  price: z.coerce.number().int().min(0, { error: "Harga tidak boleh negatif." }).max(100_000_000),
})

const OrderSchema = z.object({
  customerName: z.string().trim().min(1, { error: "Nama pembeli wajib diisi." }).max(100),
  customerContact: z.string().trim().max(100).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { error: "Tanggal tidak valid." }),
  paymentMethod: z.enum(["CASH", "TRANSFER", "QRIS", "OTHER"]),
  status: z.enum(STATUSES),
  note: z.string().trim().max(1000).optional(),
  items: z.array(ItemSchema).min(1, { error: "Tambahkan minimal satu komponen." }).max(100),
})

function readOrder(formData: FormData) {
  let items: unknown = []
  try {
    items = JSON.parse(String(formData.get("items") ?? "[]"))
  } catch {
    items = []
  }
  const parsed = OrderSchema.safeParse({
    customerName: formData.get("customerName"),
    customerContact: formData.get("customerContact") || undefined,
    date: formData.get("date"),
    paymentMethod: formData.get("paymentMethod"),
    status: formData.get("status"),
    note: formData.get("note") || undefined,
    items,
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data transaksi tidak valid." }
  // Gabungkan baris dengan produk & harga sama agar tidak dobel.
  const merged = new Map<string, { productId: string; quantity: number; price: number }>()
  for (const item of parsed.data.items) {
    const key = `${item.productId}:${item.price}`
    const existing = merged.get(key)
    if (existing) existing.quantity += item.quantity
    else merged.set(key, { ...item })
  }
  return { data: { ...parsed.data, items: [...merged.values()] } }
}

const total = (items: { quantity: number; price: number }[]) => items.reduce((sum, i) => sum + i.quantity * i.price, 0)

async function nextOrderNumber(tx: Prisma.TransactionClient, date: Date) {
  const prefix = `MCR-${toDateInputWIB(date).slice(2).replaceAll("-", "")}-`
  const last = await tx.order.findFirst({ where: { orderNumber: { startsWith: prefix } }, orderBy: { orderNumber: "desc" }, select: { orderNumber: true } })
  const seq = last ? Number(last.orderNumber.slice(prefix.length)) + 1 : 1
  return `${prefix}${String(seq).padStart(3, "0")}`
}

function refresh() {
  revalidatePath("/admin", "layout")
}

function failure(error: unknown): OrderFormState {
  if (error instanceof StockError) return { error: error.message }
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return { error: "Nomor transaksi bentrok, coba simpan sekali lagi." }
  console.error(error)
  return { error: "Gagal menyimpan transaksi. Coba lagi." }
}

export async function createOrder(_state: OrderFormState, formData: FormData): Promise<OrderFormState> {
  await requireAdmin()
  const parsed = readOrder(formData)
  if ("error" in parsed) return { error: parsed.error }
  const { items, date, ...fields } = parsed.data
  const createdAt = fromDateInputWIB(date)
  let id: string
  try {
    id = await db.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          ...fields,
          customerContact: fields.customerContact ?? null,
          note: fields.note ?? null,
          orderNumber: await nextOrderNumber(tx, createdAt),
          totalAmount: total(items),
          createdAt,
          items: { create: items },
        },
      })
      await applyStockChanges(tx, usage(items, fields.status !== "CANCELLED"), { orderId: order.id, note: `Transaksi ${order.orderNumber}` })
      return order.id
    })
  } catch (error) {
    return failure(error)
  }
  refresh()
  redirect(`/admin/transaksi/${id}?saved=1`)
}

export async function updateOrder(id: string, _state: OrderFormState, formData: FormData): Promise<OrderFormState> {
  await requireAdmin()
  const parsed = readOrder(formData)
  if ("error" in parsed) return { error: parsed.error }
  const { items, date, ...fields } = parsed.data
  try {
    await db.$transaction(async (tx) => {
      const old = await tx.order.findUnique({ where: { id }, include: { items: true } })
      if (!old) throw new StockError("Transaksi tidak ditemukan.")
      const before = usage(old.items, old.status !== "CANCELLED")
      const after = usage(items, fields.status !== "CANCELLED")
      // Kembalikan stok lebih dulu, baru kurangi, supaya tukar produk tidak salah dianggap kurang stok.
      const diff = diffUsage(before, after)
      const returns = new Map([...diff].filter(([, d]) => d < 0))
      const sales = new Map([...diff].filter(([, d]) => d > 0))
      const note = `Edit transaksi ${old.orderNumber}`
      await applyStockChanges(tx, returns, { orderId: id, note })
      await applyStockChanges(tx, sales, { orderId: id, note })
      const sameDay = toDateInputWIB(old.createdAt) === date
      await tx.orderItem.deleteMany({ where: { orderId: id } })
      await tx.order.update({
        where: { id },
        data: {
          ...fields,
          customerContact: fields.customerContact ?? null,
          note: fields.note ?? null,
          totalAmount: total(items),
          ...(sameDay ? {} : { createdAt: fromDateInputWIB(date) }),
          items: { create: items },
        },
      })
    })
  } catch (error) {
    return failure(error)
  }
  refresh()
  redirect(`/admin/transaksi/${id}?saved=1`)
}

export async function setOrderStatus(id: string, formData: FormData) {
  await requireAdmin()
  const status = z.enum(STATUSES).safeParse(formData.get("status"))
  if (!status.success) redirect(`/admin/transaksi/${id}`)
  let error: string | null = null
  try {
    await db.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id }, include: { items: true } })
      if (!order || order.status === status.data) return
      const wasActive = order.status !== "CANCELLED"
      const nowActive = status.data !== "CANCELLED"
      if (wasActive !== nowActive) {
        const diff = diffUsage(usage(order.items, wasActive), usage(order.items, nowActive))
        await applyStockChanges(tx, diff, {
          orderId: id,
          note: `${order.orderNumber}: ${orderStatusLabel[order.status]} → ${orderStatusLabel[status.data as OrderStatus]}`,
        })
      }
      await tx.order.update({ where: { id }, data: { status: status.data } })
    })
  } catch (e) {
    error = e instanceof StockError ? e.message : "Gagal mengubah status."
    if (!(e instanceof StockError)) console.error(e)
  }
  refresh()
  redirect(error ? `/admin/transaksi/${id}?error=${encodeURIComponent(error)}` : `/admin/transaksi/${id}?saved=1`)
}

export async function deleteOrder(id: string) {
  await requireAdmin()
  await db.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id }, include: { items: true } })
    if (!order) return
    const back = new Map([...usage(order.items, order.status !== "CANCELLED")].map(([pid, q]) => [pid, -q]))
    await applyStockChanges(tx, back, { orderId: null, note: `Transaksi ${order.orderNumber} dihapus` })
    await tx.order.delete({ where: { id } })
  })
  refresh()
  redirect("/admin/transaksi?deleted=1")
}
