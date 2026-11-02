import type { OrderStatus } from "@prisma/client"
import { orderStatusLabel, orderStatusTone } from "@/lib/admin/format"

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`admin-badge is-${orderStatusTone[status]}`}>{orderStatusLabel[status]}</span>
}
