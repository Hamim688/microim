"use client"

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type MouseEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowUpRight, Menu, X } from "lucide-react"

type NavItem = { name: string; sectionId: string; page?: string }

// Menu navbar selalu menuju section-nya di Beranda. Halaman lengkapnya (/about, /services, dst.)
// dibuka dari footer "Tautan" & tombol di section; saat sedang di halaman itu, menunya menyala
// dan tetap di halaman tersebut (tidak dilempar balik ke Beranda).
const navLinks: NavItem[] = [
  { name: "Beranda", sectionId: "home" },
  { name: "Tentang", sectionId: "about", page: "/about" },
  { name: "Layanan", sectionId: "services-core", page: "/services" },
  { name: "Produk", sectionId: "products", page: "/products" },
  { name: "Proyek", sectionId: "projects", page: "/projects" },
  { name: "Kontak", sectionId: "contact", page: "/contact" },
]

/** Navbar HP baru boleh sembunyi setelah halaman di-scroll sejauh ini (px). */
const HIDE_AFTER = 120
/** Gerakan scroll lebih kecil dari ini diabaikan, supaya navbar tidak berkedip. */
const SCROLL_TOLERANCE = 6

/** Efek "meregang" pil saat berpindah: melebar di desktop, memanjang di menu HP. */
const STRETCH_X: Keyframe[] = [{ scale: "1 1" }, { scale: "1.12 .84", offset: 0.35 }, { scale: ".98 1.04", offset: 0.7 }, { scale: "1 1" }]
const STRETCH_Y: Keyframe[] = [{ scale: "1 1" }, { scale: ".97 1.22", offset: 0.35 }, { scale: "1.01 .96", offset: 0.7 }, { scale: "1 1" }]

type PillBox = { name: string; x: number; y: number; w: number; h: number }

/** Pil mulai muncul setelah kapsul menu selesai turun (ms). */
const PILL_ENTER_DELAY = 380
/** Teks menu aktif langsung berganti putih → hitam begitu pil mulai tampak (ms). */
const LABEL_DARKEN_AFTER = PILL_ENTER_DELAY + 40

/** Animasi masuk pil emas saat situs pertama dibuka: muncul dari kecil, sedikit meregang, lalu pas. */
const PILL_ENTER: Keyframe[] = [
  { opacity: 0, scale: ".45 .6" },
  // Langsung tampak jelas (bukan memudar pelan), jadi teks hitam di atasnya tetap terbaca.
  { opacity: 1, scale: ".55 .66", offset: 0.12 },
  { opacity: 1, scale: "1.08 .92", offset: 0.6 },
  { opacity: 1, scale: "1 1" },
]

/**
 * Letakkan pil emas di bawah menu aktif. Posisi diukur relatif ke kapsul menu (offsetLeft/Top),
 * bukan ke halaman, sehingga pil tidak pernah ikut naik/turun saat halaman di-scroll atau berganti.
 * Pertama kali pil langsung di tempat; saat menu aktif berganti pil meluncur lewat transisi CSS
 * + efek meregang; saat ukuran kapsul berubah pil menyesuaikan dengan halus.
 */
function placePill(
  nav: HTMLElement | null,
  pill: HTMLElement | null,
  name: string | null,
  last: PillBox | null,
  stretch: Keyframe[],
  duration: number,
  enter = false,
): PillBox | null {
  if (!nav || !pill) return last
  const link = name ? nav.querySelector<HTMLElement>(`a[data-nav="${name}"]`) : null
  if (!link || !name || link.offsetWidth === 0) {
    pill.style.opacity = "0"
    return null
  }
  const box: PillBox = { name, x: link.offsetLeft, y: link.offsetTop, w: link.offsetWidth, h: link.offsetHeight }
  if (last && last.name === box.name && last.x === box.x && last.y === box.y && last.w === box.w && last.h === box.h) return last
  // Hanya penempatan pertama yang tanpa transisi. Perubahan ukuran di tengah luncuran (mis. scrollbar
  // muncul lagi saat menu HP ditutup) cukup mengarahkan ulang transisi, jadi luncuran tidak terpotong.
  const first = last === null
  const moved = !first && last.name !== box.name
  if (first) pill.classList.add("no-transition")
  pill.style.width = `${box.w}px`
  pill.style.height = `${box.h}px`
  // Properti `translate` (bukan `transform`) supaya efek `scale` tidak ikut memperbesar jarak geser.
  pill.style.translate = `${box.x}px ${box.y}px`
  pill.style.opacity = "1"
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (first) {
    void pill.offsetWidth // terapkan posisi tanpa transisi, baru nyalakan lagi transisinya
    pill.classList.remove("no-transition")
    // Muncul setelah kapsul menu selesai turun (lihat animasi header-in di globals.css).
    if (enter && !reduceMotion) pill.animate(PILL_ENTER, { duration: 650, delay: PILL_ENTER_DELAY, easing: "cubic-bezier(.22, 1, .36, 1)", fill: "backwards" })
  } else if (moved && !reduceMotion) {
    pill.animate(stretch, { duration, easing: "cubic-bezier(.3, .7, .3, 1)" })
  }
  return box
}

/** Nama menu yang aktif untuk halaman/section tertentu. */
function activeName(pathname: string, activeSection: string) {
  const onHome = pathname === "/"
  return (
    navLinks.find((item) =>
      onHome ? activeSection === item.sectionId : item.page !== undefined && (pathname === item.page || pathname.startsWith(`${item.page}/`)),
    )?.name ?? null
  )
}

/** true hanya di browser setelah hidrasi (false di server). */
const noopSubscribe = () => () => {}
function useIsClient() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false)
}

export function Navbar() {
  const pathname = usePathname() ?? ""
  // Status "menu aktif" hanya ditentukan di browser: halaman yang diregenerasi berkala (ISR) bisa dirender
  // di server tanpa tahu URL-nya, dan React produksi tidak memperbaiki kelas yang berbeda saat hidrasi
  // (teks menu aktif sempat tertahan abu di atas pil kuning). Pil sendiri juga baru muncul di browser.
  const isClient = useIsClient()
  const onHome = pathname === "/"
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  const headerRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const mobileNavRef = useRef<HTMLElement>(null)
  const desktopNavRef = useRef<HTMLElement>(null)
  const desktopPillRef = useRef<HTMLSpanElement>(null)
  const mobilePillRef = useRef<HTMLSpanElement>(null)
  const pillBoxes = useRef<{ desktop: PillBox | null; mobile: PillBox | null }>({ desktop: null, mobile: null })
  // Animasi "muncul" pil hanya sekali per kunjungan (navbar tidak dimuat ulang saat pindah halaman).
  const pillEntered = useRef(false)
  // Sejak HTML awal, teks menu aktif putih (pil belum ada). Fase: 0 = putih, 1 = langsung hitam (tanpa
  // transisi warna), 2 = normal (transisi warna saat pindah menu berlaku lagi).
  const [entryPhase, setEntryPhase] = useState(0)
  // Di Beranda, pil baru diletakkan setelah scroll spy tahu section yang terlihat (termasuk posisi scroll
  // yang dipulihkan browser setelah refresh), supaya animasi "muncul" terjadi di menu yang benar.
  const [spyReady, setSpyReady] = useState(false)
  const labelTimersStarted = useRef(false)
  // Saat menu diklik, pil langsung pindah ke tujuan dan scroll spy "dikunci"
  // sampai scroll halus selesai, supaya pil tidak mampir ke section yang dilewati.
  const lockRef = useRef<string | null>(null)
  const unlockTimer = useRef<number | undefined>(undefined)
  const closeTimer = useRef<number | undefined>(undefined)
  const lastScrollY = useRef(0)

  // Pindah halaman: menu HP ikut tertutup (disesuaikan saat render, tanpa efek tambahan).
  const [prevPath, setPrevPath] = useState(pathname)
  if (prevPath !== pathname) {
    setPrevPath(pathname)
    setIsOpen(false)
  }

  const current = activeName(pathname, activeSection)
  const onOwnPage = (item: NavItem) => item.page !== undefined && pathname === item.page
  const hrefFor = (item: NavItem) => (onOwnPage(item) ? item.page! : item.sectionId === "home" ? "/" : `/#${item.sectionId}`)

  // Pil emas: satu elemen per kapsul menu yang tetap ada selama pindah halaman, jadi setiap kali
  // menu aktif berganti (di Beranda maupun antar halaman) pil meluncur ke samping. Bila ukuran kapsul
  // berubah (font selesai dimuat, layar diputar, menu HP tampil), pil langsung disesuaikan.
  useLayoutEffect(() => {
    if (onHome && !spyReady) return
    const update = () => {
      pillBoxes.current.desktop = placePill(desktopNavRef.current, desktopPillRef.current, current, pillBoxes.current.desktop, STRETCH_X, 600, !pillEntered.current)
      if (pillBoxes.current.desktop) pillEntered.current = true
      pillBoxes.current.mobile = placePill(mobileNavRef.current, mobilePillRef.current, current, pillBoxes.current.mobile, STRETCH_Y, 500)
    }
    update()
    // Teks menu aktif: putih sampai pil muncul, lalu langsung hitam (dihitung dari saat pil diletakkan).
    if (!labelTimersStarted.current) {
      labelTimersStarted.current = true
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const darken = pillEntered.current && !reduceMotion ? LABEL_DARKEN_AFTER : 0
      window.setTimeout(() => setEntryPhase(1), darken)
      window.setTimeout(() => setEntryPhase(2), darken + 120)
    }
    const observer = new ResizeObserver(update)
    for (const nav of [desktopNavRef.current, mobileNavRef.current]) if (nav) observer.observe(nav)
    return () => observer.disconnect()
  }, [current, onHome, spyReady])

  const closeMenu = (returnFocus = false) => {
    setIsOpen(false)
    if (returnFocus) menuButtonRef.current?.focus()
  }

  // Scroll: efek blur header, navbar HP sembunyi/muncul, dan scroll spy di Beranda.
  useEffect(() => {
    const computeActive = () => {
      const marker = window.innerHeight * 0.35
      let current = "home"
      for (const { sectionId } of navLinks) {
        const element = document.getElementById(sectionId)
        if (element && element.getBoundingClientRect().top <= marker) current = sectionId
      }
      const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      return nearBottom ? "contact" : current
    }

    const handleScroll = () => {
      const y = window.scrollY
      setIsScrolled(y > 20)
      const delta = y - lastScrollY.current
      if (y <= HIDE_AFTER) {
        setIsHidden(false)
        lastScrollY.current = y
      } else if (Math.abs(delta) > SCROLL_TOLERANCE) {
        setIsHidden(delta > 0)
        lastScrollY.current = y
      }

      if (!onHome) return
      if (lockRef.current) {
        window.clearTimeout(unlockTimer.current)
        unlockTimer.current = window.setTimeout(() => {
          lockRef.current = null
          setActiveSection(computeActive())
        }, 160)
        return
      }
      setActiveSection(computeActive())
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })

    let frame = 0
    const markReady = () => {
      frame = window.requestAnimationFrame(() => {
        handleScroll()
        setSpyReady(true)
      })
    }
    if (document.readyState === "complete") markReady()
    else window.addEventListener("load", markReady, { once: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("load", markReady)
      window.cancelAnimationFrame(frame)
      window.clearTimeout(unlockTimer.current)
    }
  }, [onHome])

  // Menu HP terbuka: kunci scroll halaman, fokus ke menu pertama, tahan Tab di dalam menu,
  // tutup dengan Esc atau ketukan di luar (fokus kembali ke tombol menu).
  useEffect(() => {
    if (!isOpen) return
    // Dikunci di <body> (bukan <html>): body sudah overflow-x: hidden, jadi mengunci <html>
    // membuat body jadi kontainer scroll sendiri dan header sticky ikut tergeser.
    const body = document.body
    const previousOverflow = body.style.overflow
    body.style.overflow = "hidden"

    const focusables = () =>
      [menuButtonRef.current, ...Array.from(mobileNavRef.current?.querySelectorAll<HTMLElement>("a") ?? [])].filter(
        (el): el is HTMLElement => el !== null,
      )
    const frame = window.requestAnimationFrame(() => mobileNavRef.current?.querySelector<HTMLElement>("a")?.focus())

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
        menuButtonRef.current?.focus()
        return
      }
      if (event.key !== "Tab") return
      const items = focusables()
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    const onPointer = (event: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) setIsOpen(false)
    }

    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onPointer)
    return () => {
      window.cancelAnimationFrame(frame)
      body.style.overflow = previousOverflow
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onPointer)
    }
  }, [isOpen])

  // Di Beranda, link ke "/" dianggap Next.js navigasi ke halaman yang sama sehingga posisi scroll tidak
  // berubah. Jadi saat sudah di Beranda, "Beranda" & logo langsung menggulir halus ke paling atas.
  const scrollToTopIfHome = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!onHome) return
    event.preventDefault()
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })
    if (window.location.hash) window.history.replaceState(null, "", "/")
  }

  const selectSection = (item: NavItem, event: MouseEvent<HTMLAnchorElement>) => {
    const { sectionId } = item
    if (sectionId === "home") scrollToTopIfHome(event)
    // Di HP, beri waktu pil emas meluncur ke menu tujuan sebelum menu ditutup.
    window.clearTimeout(closeTimer.current)
    if (isOpen) closeTimer.current = window.setTimeout(() => setIsOpen(false), 380)
    if (onOwnPage(item)) return
    // Section tujuan langsung dicatat (juga saat datang dari halaman Produk/Kontak), supaya pil
    // meluncur ke menu yang dipilih dan scroll spy tidak mampir ke section yang dilewati.
    lockRef.current = sectionId
    setActiveSection(sectionId)
    window.clearTimeout(unlockTimer.current)
    unlockTimer.current = window.setTimeout(() => {
      lockRef.current = null
    }, 1500)
  }

  const headerClass = ["site-header", isScrolled && "is-scrolled", isHidden && !isOpen && "is-hidden"].filter(Boolean).join(" ")

  return (
    <header ref={headerRef} className={headerClass}>
      <div className="site-header-inner">
        <Link
          href="/"
          className="brand-link"
          aria-label="Beranda Microim"
          onClick={(event) => {
            setIsOpen(false)
            scrollToTopIfHome(event)
          }}
        >
          <Image src="/logo/logo-baru.png" alt="" width={40} height={40} priority quality={100} />
          <span className="brand-name" aria-hidden="true">Microim</span>
        </Link>
        <nav ref={desktopNavRef} className={`desktop-nav${entryPhase === 0 ? " is-entering is-switching" : entryPhase === 1 ? " is-switching" : ""}`} aria-label="Navigasi utama">
          {navLinks.map((item) => {
            const active = isClient && current === item.name
            return (
              <Link aria-current={active ? "page" : undefined} className={active ? "active" : ""} data-nav={item.name} href={hrefFor(item)} key={item.name} onClick={(event) => selectSection(item, event)}>
                <span className="nav-label">{item.name}</span>
              </Link>
            )
          })}
          <span ref={desktopPillRef} className="nav-pill" aria-hidden="true" />
        </nav>
        <div className="header-actions">
          <Link className="header-cta" href="/contact">Mulai Proyek <ArrowUpRight aria-hidden="true" /></Link>
          <button
            ref={menuButtonRef}
            className="mobile-menu-button"
            type="button"
            aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            onClick={() => (isOpen ? closeMenu(true) : setIsOpen(true))}
          >
            {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div className={`mobile-nav-backdrop${isOpen ? " is-open" : ""}`} aria-hidden="true" onClick={() => closeMenu(true)} />
      <nav ref={mobileNavRef} className={`mobile-nav${isOpen ? " is-open" : ""}`} id="mobile-navigation" aria-label="Navigasi seluler" inert={!isOpen}>
        {navLinks.map((item) => {
          const active = isClient && current === item.name
          return (
            <Link href={hrefFor(item)} key={item.name} className={active ? "active" : ""} aria-current={active ? "page" : undefined} data-nav={item.name} onClick={(event) => selectSection(item, event)}>
              <span className="nav-label">{item.name}</span>
            </Link>
          )
        })}
        <Link className="mobile-nav-cta" href="/contact" onClick={() => setIsOpen(false)}>
          Mulai Proyek <ArrowUpRight aria-hidden="true" />
        </Link>
        <span ref={mobilePillRef} className="nav-pill" aria-hidden="true" />
      </nav>
    </header>
  )
}
