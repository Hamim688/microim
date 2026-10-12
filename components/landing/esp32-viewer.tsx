"use client"

import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import type * as ThreeNS from "three"
import { Rotate3d } from "lucide-react"

type Three = typeof ThreeNS

const PCB = { w: 2.8, h: 0.16, l: 5.2 }
const TOP = PCB.h / 2
const PITCH = 0.254
const PIN_COUNT = 19
const PIN_ROW_X = 1.27

const leftPins = ["3V3", "EN", "VP", "VN", "D34", "D35", "D32", "D33", "D25", "D26", "D27", "D14", "D12", "GND", "D13", "SD2", "SD3", "CMD", "5V"]
const rightPins = ["GND", "D23", "D22", "TX0", "RX0", "D21", "GND", "D19", "D18", "D5", "D17", "D16", "D4", "D0", "D2", "D15", "SD1", "SD0", "CLK"]

function pinZ(i: number) {
  return -((PIN_COUNT - 1) / 2) * PITCH + i * PITCH
}

function makeCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas 2D tidak tersedia")
  return { canvas, ctx }
}

function silkscreenTexture(THREE: Three) {
  const scale = 200
  const { canvas, ctx } = makeCanvas(PCB.w * scale, PCB.l * scale)
  const u = (x: number) => (x + PCB.w / 2) * scale
  const v = (z: number) => (z + PCB.l / 2) * scale

  ctx.fillStyle = "#0e1724"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // copper traces (subtle)
  ctx.strokeStyle = "rgba(120, 150, 190, 0.16)"
  ctx.lineWidth = 3
  for (let i = 2; i < PIN_COUNT - 1; i += 2) {
    ctx.beginPath()
    ctx.moveTo(u(-PIN_ROW_X), v(pinZ(i)))
    ctx.lineTo(u(-0.75), v(pinZ(i)))
    ctx.lineTo(u(-0.45), v(pinZ(i) + 0.3))
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(u(PIN_ROW_X), v(pinZ(i + 1)))
    ctx.lineTo(u(0.8), v(pinZ(i + 1)))
    ctx.lineTo(u(0.5), v(pinZ(i + 1) - 0.25))
    ctx.stroke()
  }

  // pin labels
  ctx.fillStyle = "#e6ebf2"
  ctx.font = "600 21px monospace"
  ctx.textBaseline = "middle"
  leftPins.forEach((label, i) => {
    ctx.textAlign = "left"
    ctx.fillText(label, u(-PIN_ROW_X + 0.2), v(pinZ(i)))
  })
  rightPins.forEach((label, i) => {
    ctx.textAlign = "right"
    ctx.fillText(label, u(PIN_ROW_X - 0.2), v(pinZ(i)))
  })

  // module outline + labels
  ctx.strokeStyle = "rgba(230, 235, 242, 0.75)"
  ctx.lineWidth = 3
  ctx.strokeRect(u(-0.95), v(-2.62), 1.9 * scale, 2.6 * scale)
  ctx.textAlign = "center"
  ctx.font = "700 30px sans-serif"
  ctx.fillText("ESP32-DEVKIT", u(0), v(1.95))
  ctx.fillStyle = "#ffc928"
  ctx.font = "600 22px monospace"
  ctx.fillText("MIKROIM · IOT LAB", u(0), v(2.15))
  ctx.fillStyle = "#e6ebf2"
  ctx.font = "600 20px monospace"
  ctx.fillText("EN", u(-0.85), v(2.5))
  ctx.fillText("BOOT", u(0.85), v(2.5))

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

function shieldTexture(THREE: Three) {
  const { canvas, ctx } = makeCanvas(640, 700)
  const gradient = ctx.createLinearGradient(0, 0, 640, 700)
  gradient.addColorStop(0, "#d9dde3")
  gradient.addColorStop(0.5, "#b9bec6")
  gradient.addColorStop(1, "#d1d5db")
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 640, 700)
  for (let y = 0; y < 700; y += 3) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.06})`
    ctx.fillRect(0, y, 640, 1)
  }
  ctx.fillStyle = "#2a2f38"
  ctx.textAlign = "center"
  ctx.font = "700 64px sans-serif"
  ctx.fillText("ESP-WROOM-32", 320, 300)
  ctx.font = "500 36px monospace"
  ctx.fillText("Wi-Fi · BT · BLE", 320, 380)
  ctx.strokeStyle = "#2a2f38"
  ctx.lineWidth = 4
  ctx.strokeRect(150, 470, 340, 90)
  ctx.font = "600 34px monospace"
  ctx.fillText("240 MHz · 2 CORE", 320, 527)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

function shadowTexture(THREE: Three) {
  const { canvas, ctx } = makeCanvas(256, 256)
  const g = ctx.createRadialGradient(128, 128, 10, 128, 128, 128)
  g.addColorStop(0, "rgba(0,0,0,0.55)")
  g.addColorStop(1, "rgba(0,0,0,0)")
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 256)
  return new THREE.CanvasTexture(canvas)
}

function buildBoard(THREE: Three) {
  const board = new THREE.Group()
  const box = (w: number, h: number, l: number) => new THREE.BoxGeometry(w, h, l)
  const std = (color: number, roughness = 0.6, metalness = 0) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness })

  const gold = std(0xd9a93a, 0.28, 1)
  const steel = std(0xc3c8cf, 0.3, 1)
  const blackPlastic = std(0x111216, 0.55)
  const chipBlack = std(0x16181c, 0.45)

  // PCB with printed top face
  const pcbEdge = std(0x0b121d, 0.7)
  const pcbTop = new THREE.MeshStandardMaterial({ map: silkscreenTexture(THREE), roughness: 0.62 })
  const pcb = new THREE.Mesh(box(PCB.w, PCB.h, PCB.l), [pcbEdge, pcbEdge, pcbTop, pcbEdge, pcbEdge, pcbEdge])
  board.add(pcb)

  // ESP-WROOM-32 module
  const moduleBase = new THREE.Mesh(box(1.8, 0.08, 2.55), std(0x141a26, 0.5))
  moduleBase.position.set(0, TOP + 0.04, -1.36)
  board.add(moduleBase)

  const shieldSide = steel
  const shieldTop = new THREE.MeshStandardMaterial({ map: shieldTexture(THREE), roughness: 0.38, metalness: 0.85 })
  const shield = new THREE.Mesh(box(1.6, 0.25, 1.75), [shieldSide, shieldSide, shieldTop, shieldSide, shieldSide, shieldSide])
  shield.position.set(0, TOP + 0.08 + 0.125, -0.99)
  board.add(shield)

  // PCB antenna meander
  const antenna = new THREE.Group()
  const zTop = -2.5
  const segments = 6
  for (let i = 0; i < segments; i += 1) {
    const x = -0.7 + i * 0.25
    const vertical = new THREE.Mesh(box(0.05, 0.012, 0.42), gold)
    vertical.position.set(x, 0, zTop + 0.21)
    antenna.add(vertical)
    if (i < segments - 1) {
      const horizontal = new THREE.Mesh(box(0.3, 0.012, 0.05), gold)
      horizontal.position.set(x + 0.125, 0, i % 2 === 0 ? zTop + 0.42 : zTop)
      antenna.add(horizontal)
    }
  }
  antenna.position.y = TOP + 0.087
  board.add(antenna)

  // header strips + pins + pads
  const pinGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.95, 8)
  const padGeo = new THREE.CylinderGeometry(0.075, 0.075, 0.02, 16)
  const pins = new THREE.InstancedMesh(pinGeo, gold, PIN_COUNT * 2)
  const pads = new THREE.InstancedMesh(padGeo, gold, PIN_COUNT * 2)
  const matrix = new THREE.Matrix4()
  let n = 0
  for (const side of [-1, 1]) {
    const strip = new THREE.Mesh(box(0.25, 0.25, PIN_COUNT * PITCH), blackPlastic)
    strip.position.set(side * PIN_ROW_X, -PCB.h / 2 - 0.125, 0)
    board.add(strip)
    for (let i = 0; i < PIN_COUNT; i += 1) {
      matrix.makeTranslation(side * PIN_ROW_X, -0.4, pinZ(i))
      pins.setMatrixAt(n, matrix)
      matrix.makeTranslation(side * PIN_ROW_X, TOP + 0.01, pinZ(i))
      pads.setMatrixAt(n, matrix)
      n += 1
    }
  }
  board.add(pins, pads)

  // micro USB connector
  const usb = new THREE.Mesh(box(0.78, 0.3, 0.58), steel)
  usb.position.set(0, TOP + 0.15, 2.38)
  board.add(usb)
  const usbHole = new THREE.Mesh(box(0.56, 0.12, 0.02), std(0x050608, 0.9))
  usbHole.position.set(0, TOP + 0.15, 2.675)
  board.add(usbHole)

  // EN / BOOT buttons
  for (const x of [-0.85, 0.85]) {
    const base = new THREE.Mesh(box(0.42, 0.14, 0.34), steel)
    base.position.set(x, TOP + 0.07, 2.25)
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.08, 20), blackPlastic)
    cap.position.set(x, TOP + 0.18, 2.25)
    board.add(base, cap)
  }

  // USB-UART bridge chip with legs
  const bridge = new THREE.Mesh(box(0.5, 0.08, 0.5), chipBlack)
  bridge.position.set(0.38, TOP + 0.04, 1.3)
  board.add(bridge)
  const legGeo = box(0.03, 0.02, 0.07)
  const legs = new THREE.InstancedMesh(legGeo, steel, 28)
  let leg = 0
  for (let i = 0; i < 7; i += 1) {
    const offset = -0.18 + i * 0.06
    for (const [x, z, rot] of [
      [0.38 + offset, 1.3 - 0.29, 0],
      [0.38 + offset, 1.3 + 0.29, 0],
      [0.38 - 0.29, 1.3 + offset, Math.PI / 2],
      [0.38 + 0.29, 1.3 + offset, Math.PI / 2],
    ] as const) {
      matrix.makeRotationY(rot)
      matrix.setPosition(x, TOP + 0.01, z)
      legs.setMatrixAt(leg, matrix)
      leg += 1
    }
  }
  board.add(legs)

  // voltage regulator
  const regulator = new THREE.Mesh(box(0.62, 0.14, 0.34), chipBlack)
  regulator.position.set(-0.5, TOP + 0.07, 0.62)
  const regulatorTab = new THREE.Mesh(box(0.62, 0.02, 0.16), steel)
  regulatorTab.position.set(-0.5, TOP + 0.01, 0.38)
  board.add(regulator, regulatorTab)

  // small SMD parts
  const smdGeo = box(0.12, 0.05, 0.065)
  const beige = new THREE.InstancedMesh(smdGeo, std(0xc6a978, 0.5), 10)
  const dark = new THREE.InstancedMesh(smdGeo, std(0x1d1f24, 0.4), 10)
  const spots: Array<[number, number]> = [
    [-0.75, 0.25], [-0.55, 0.25], [0.0, 0.3], [0.2, 0.3], [0.55, 0.45], [0.75, 0.45],
    [-0.75, 1.05], [-0.55, 1.05], [-0.15, 0.95], [-0.15, 1.15], [0.9, 1.0], [0.9, 1.2],
    [-0.75, 1.55], [-0.55, 1.55], [-0.2, 1.6], [0.0, 1.6], [0.85, 1.65], [0.65, 1.65],
    [-0.3, 2.2], [0.3, 2.2],
  ]
  spots.forEach(([x, z], i) => {
    matrix.makeRotationY(i % 3 === 0 ? Math.PI / 2 : 0)
    matrix.setPosition(x, TOP + 0.025, z)
    if (i % 2 === 0) beige.setMatrixAt(i / 2, matrix)
    else dark.setMatrixAt((i - 1) / 2, matrix)
  })
  board.add(beige, dark)

  // status LEDs
  const ledRed = new THREE.Mesh(box(0.1, 0.05, 0.06), new THREE.MeshStandardMaterial({ color: 0xff4d4d, emissive: 0xff2a2a, emissiveIntensity: 2.2 }))
  ledRed.position.set(-0.35, TOP + 0.025, 1.85)
  const ledBlue = new THREE.Mesh(box(0.1, 0.05, 0.06), new THREE.MeshStandardMaterial({ color: 0x6fb6ff, emissive: 0x3b8cff, emissiveIntensity: 2.2 }))
  ledBlue.position.set(0.35, TOP + 0.025, 1.85)
  board.add(ledRed, ledBlue)

  // tilt the board so it reads well at rest
  board.rotation.x = 0
  return board
}

export function Esp32Viewer({ children }: { children?: ReactNode }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [interacted, setInteracted] = useState(false)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    let disposed = false
    let cleanup = () => {}

    ;(async () => {
      const THREE = await import("three")
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js")
      if (disposed) return

      let renderer: ThreeNS.WebGLRenderer
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" })
      } catch {
        return
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.05
      renderer.domElement.className = "esp32-canvas"
      renderer.domElement.setAttribute("aria-hidden", "true")
      mount.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const pmrem = new THREE.PMREMGenerator(renderer)
      const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
      scene.environment = envTexture
      scene.environmentIntensity = 0.55

      const camera = new THREE.PerspectiveCamera(30, 1.5, 0.1, 100)
      camera.position.set(0, 6.3, 10.2)
      camera.lookAt(0, -0.2, 0)

      scene.add(new THREE.HemisphereLight(0xc9dcff, 0x071426, 0.8))
      const key = new THREE.DirectionalLight(0xffffff, 1.7)
      key.position.set(4, 7, 5)
      scene.add(key)
      const rim = new THREE.PointLight(0xffc928, 40, 18)
      rim.position.set(-4.5, 2.5, -3.5)
      scene.add(rim)
      const fill = new THREE.PointLight(0x6fa8ff, 18, 16)
      fill.position.set(4.5, 1.5, -4)
      scene.add(fill)

      const shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(6.5, 6.5),
        new THREE.MeshBasicMaterial({ map: shadowTexture(THREE), transparent: true, depthWrite: false }),
      )
      shadow.rotation.x = -Math.PI / 2
      shadow.position.y = -1.1
      scene.add(shadow)

      const pivot = new THREE.Group()
      const board = buildBoard(THREE)
      pivot.add(board)
      scene.add(pivot)

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const state = {
        rotY: -0.75,
        rotX: 0.12,
        velY: 0,
        velX: 0,
        dragging: false,
        lastX: 0,
        lastY: 0,
        idleSince: performance.now(),
      }

      const resize = () => {
        const { clientWidth, clientHeight } = mount
        if (!clientWidth || !clientHeight) return
        renderer.setSize(clientWidth, clientHeight, false)
        camera.aspect = clientWidth / clientHeight
        // keep the whole board in frame on narrow/tall stages
        camera.fov = camera.aspect < 1.3 ? 36 : 30
        camera.updateProjectionMatrix()
      }
      resize()
      const resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(mount)

      const onPointerDown = (event: PointerEvent) => {
        state.dragging = true
        state.lastX = event.clientX
        state.lastY = event.clientY
        state.velX = 0
        state.velY = 0
        mount.setPointerCapture(event.pointerId)
        mount.classList.add("is-dragging")
        setInteracted(true)
      }
      const onPointerMove = (event: PointerEvent) => {
        if (!state.dragging) return
        const dx = event.clientX - state.lastX
        const dy = event.clientY - state.lastY
        state.lastX = event.clientX
        state.lastY = event.clientY
        state.velY = dx * 0.0085
        state.velX = event.pointerType === "touch" ? 0 : dy * 0.0085
        state.rotY += state.velY
        state.rotX = Math.max(-1.1, Math.min(1.1, state.rotX + state.velX))
      }
      const onPointerUp = (event: PointerEvent) => {
        if (!state.dragging) return
        state.dragging = false
        state.idleSince = performance.now()
        mount.classList.remove("is-dragging")
        if (mount.hasPointerCapture(event.pointerId)) mount.releasePointerCapture(event.pointerId)
      }
      const onKeyDown = (event: KeyboardEvent) => {
        const step = 0.25
        if (event.key === "ArrowLeft") state.rotY -= step
        else if (event.key === "ArrowRight") state.rotY += step
        else if (event.key === "ArrowUp") state.rotX = Math.max(-1.1, state.rotX - step)
        else if (event.key === "ArrowDown") state.rotX = Math.min(1.1, state.rotX + step)
        else return
        event.preventDefault()
        state.idleSince = performance.now()
        setInteracted(true)
      }
      mount.addEventListener("pointerdown", onPointerDown)
      mount.addEventListener("pointermove", onPointerMove)
      mount.addEventListener("pointerup", onPointerUp)
      mount.addEventListener("pointercancel", onPointerUp)
      mount.addEventListener("keydown", onKeyDown)

      let visible = true
      const visibilityObserver = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting
        if (visible && frame === null) frame = requestAnimationFrame(tick)
      })
      visibilityObserver.observe(mount)

      let frame: number | null = null
      let last = performance.now()
      let firstFrame = true
      const tick = (now: number) => {
        frame = null
        const dt = Math.min(0.05, (now - last) / 1000)
        last = now

        if (!state.dragging) {
          // inertia
          state.rotY += state.velY
          state.rotX = Math.max(-1.1, Math.min(1.1, state.rotX + state.velX))
          state.velY *= 0.92
          state.velX *= 0.9
          // gentle auto-spin after 2.5s idle
          if (!reduceMotion && now - state.idleSince > 2500) {
            state.rotY += dt * 0.35
            state.rotX += (0.12 - state.rotX) * dt * 0.8
          }
        }
        pivot.rotation.set(state.rotX, state.rotY, 0, "XYZ")
        pivot.position.y = reduceMotion ? 0 : Math.sin(now / 1400) * 0.05

        renderer.render(scene, camera)
        if (firstFrame) {
          firstFrame = false
          setReady(true)
        }
        if (visible && !disposed) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)

      cleanup = () => {
        if (frame !== null) cancelAnimationFrame(frame)
        resizeObserver.disconnect()
        visibilityObserver.disconnect()
        mount.removeEventListener("pointerdown", onPointerDown)
        mount.removeEventListener("pointermove", onPointerMove)
        mount.removeEventListener("pointerup", onPointerUp)
        mount.removeEventListener("pointercancel", onPointerUp)
        mount.removeEventListener("keydown", onKeyDown)
        scene.traverse((object) => {
          const mesh = object as ThreeNS.Mesh
          if (mesh.geometry) mesh.geometry.dispose()
          const materials = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : []
          materials.forEach((material) => {
            const withMap = material as ThreeNS.MeshStandardMaterial
            withMap.map?.dispose()
            material.dispose()
          })
        })
        envTexture.dispose()
        pmrem.dispose()
        renderer.dispose()
        renderer.domElement.remove()
      }
    })()

    return () => {
      disposed = true
      cleanup()
    }
  }, [])

  return (
    <div className={`esp32-stage${ready ? " is-ready" : ""}`}>
      <div className="esp32-fallback" aria-hidden={ready}>{children}</div>
      <div
        ref={mountRef}
        className="esp32-mount"
        tabIndex={0}
        role="application"
        aria-label="Model 3D papan ESP32. Geser atau gunakan tombol panah untuk memutar."
      />
      <span className={`esp32-hint${interacted ? " is-hidden" : ""}`} aria-hidden="true">
        <Rotate3d /> GESER UNTUK MEMUTAR 360°
      </span>
    </div>
  )
}
