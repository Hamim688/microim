"use client"

import type { PointerEvent, ReactNode } from "react"

export function PointerField({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return

    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width
    const y = (event.clientY - bounds.top) / bounds.height
    const style = event.currentTarget.style

    style.setProperty("--pointer-x", `${x * 100}%`)
    style.setProperty("--pointer-y", `${y * 100}%`)
    style.setProperty("--tilt-x", `${(0.5 - y) * 5}deg`)
    style.setProperty("--tilt-y", `${(x - 0.5) * 7}deg`)
    style.setProperty("--pointer-opacity", "1")
  }

  function handlePointerLeave(event: PointerEvent<HTMLDivElement>) {
    const style = event.currentTarget.style
    style.setProperty("--pointer-x", "50%")
    style.setProperty("--pointer-y", "50%")
    style.setProperty("--tilt-x", "0deg")
    style.setProperty("--tilt-y", "0deg")
    style.setProperty("--pointer-opacity", "0")
  }

  return (
    <div className={`pointer-field ${className}`} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
      <span className="pointer-field-glow" aria-hidden="true" />
      {children}
    </div>
  )
}
