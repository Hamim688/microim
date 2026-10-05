"use client"

import { useEffect, useRef } from "react"
import type { PointerEvent, ReactNode } from "react"

type Bubble = {
  x: number
  y: number
  radius: number
  opacity: number
  fade: number
  driftX: number
  driftY: number
  color: string
}

const bubbleColors = ["255, 201, 40", "255, 220, 111", "163, 206, 255", "239, 245, 255"]

export function PointerField({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bubblesRef = useRef<Bubble[]>([])
  const lastPointRef = useRef<{ x: number; y: number } | null>(null)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (!canvas || !context) return

    const resizeCanvas = () => {
      const bounds = canvas.getBoundingClientRect()
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(bounds.width * pixelRatio)
      canvas.height = Math.round(bounds.height * pixelRatio)
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    const observer = new ResizeObserver(resizeCanvas)
    observer.observe(canvas.parentElement ?? canvas)
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      observer.disconnect()
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current)
    }
  }, [])

  function animateBubbles() {
    frameRef.current = null
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (!canvas || !context) return

    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
    const liveBubbles: Bubble[] = []

    for (const bubble of bubblesRef.current) {
      bubble.opacity -= bubble.fade
      bubble.x += bubble.driftX
      bubble.y += bubble.driftY
      if (bubble.opacity <= 0) continue

      liveBubbles.push(bubble)
      const radius = bubble.radius * (0.55 + (1 - bubble.opacity) * 0.45)
      context.beginPath()
      context.arc(bubble.x, bubble.y, radius, 0, Math.PI * 2)
      context.fillStyle = `rgba(${bubble.color}, ${bubble.opacity * 0.24})`
      context.fill()
      context.lineWidth = 1
      context.strokeStyle = `rgba(${bubble.color}, ${bubble.opacity * 0.72})`
      context.stroke()
    }

    bubblesRef.current = liveBubbles
    if (liveBubbles.length > 0) frameRef.current = window.requestAnimationFrame(animateBubbles)
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const bounds = event.currentTarget.getBoundingClientRect()
    const point = { x: event.clientX - bounds.left, y: event.clientY - bounds.top }
    const previous = lastPointRef.current

    if (!previous) {
      addBubble(point.x, point.y)
      lastPointRef.current = point
    } else {
      const distance = Math.hypot(point.x - previous.x, point.y - previous.y)
      const steps = Math.min(12, Math.floor(distance / 7))
      if (steps > 0) {
        for (let step = 1; step <= steps; step += 1) {
          const progress = step / steps
          addBubble(
            previous.x + (point.x - previous.x) * progress,
            previous.y + (point.y - previous.y) * progress,
          )
        }
        lastPointRef.current = point
      }
    }

    if (frameRef.current === null) frameRef.current = window.requestAnimationFrame(animateBubbles)
  }

  function addBubble(x: number, y: number) {
    bubblesRef.current.push({
      x: x + (Math.random() - 0.5) * 9,
      y: y + (Math.random() - 0.5) * 9,
      radius: 2 + Math.random() * 5,
      opacity: 0.8,
      fade: 0.018 + Math.random() * 0.012,
      driftX: (Math.random() - 0.5) * 0.45,
      driftY: (Math.random() - 0.5) * 0.45,
      color: bubbleColors[Math.floor(Math.random() * bubbleColors.length)],
    })

    if (bubblesRef.current.length > 100) bubblesRef.current.splice(0, bubblesRef.current.length - 100)
  }

  function handlePointerLeave() {
    lastPointRef.current = null
  }

  return (
    <div className={`pointer-field ${className}`} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
      <canvas className="pointer-bubble-canvas" ref={canvasRef} aria-hidden="true" />
      {children}
    </div>
  )
}
