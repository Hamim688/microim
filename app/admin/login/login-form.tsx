"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { motion, useAnimate, useReducedMotion } from "motion/react"
import { Eye, EyeOff, Loader2, LogIn, Mail, LockKeyhole } from "lucide-react"
import { login, type FormState } from "../actions"

const EMAIL_KEY = "microim-admin-email"

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(login, undefined)
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  // Email dibuat terkontrol supaya tidak ikut terhapus saat React mereset form setelah login gagal.
  const [email, setEmail] = useState("")
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const reduce = useReducedMotion()
  const [scope, animate] = useAnimate<HTMLFormElement>()

  // Email diingat di browser ini saja (password tidak pernah disimpan).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(EMAIL_KEY)
      if (saved) {
        // localStorage hanya ada di browser; dibaca setelah mount agar HTML server & klien sama.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setEmail(saved)
        setRemember(true)
        passwordRef.current?.focus()
        return
      }
    } catch {}
    emailRef.current?.focus()
  }, [])

  // Getar kecil saat login gagal.
  useEffect(() => {
    if (state?.error && !reduce && scope.current) {
      animate(scope.current, { x: [0, -8, 7, -5, 3, 0] }, { duration: 0.4 })
      passwordRef.current?.focus()
    }
  }, [state, reduce, animate, scope])

  function rememberEmail() {
    try {
      if (remember && email.trim()) localStorage.setItem(EMAIL_KEY, email.trim())
      else localStorage.removeItem(EMAIL_KEY)
    } catch {}
  }

  return (
    <form ref={scope} action={action} onSubmit={rememberEmail} className="admin-form">
      <label className="admin-field">
        <span>Email</span>
        <div className="admin-input-icon">
          <Mail aria-hidden="true" />
          <input ref={emailRef} name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required placeholder="admin@microim.id" />
        </div>
      </label>
      <label className="admin-field">
        <span>Password</span>
        <div className="admin-input-icon">
          <LockKeyhole aria-hidden="true" />
          <input ref={passwordRef} name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required placeholder="••••••••" />
          <button
            type="button"
            className="admin-input-toggle"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            aria-pressed={showPassword}
          >
            {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
          </button>
        </div>
      </label>

      <label className="admin-check">
        <input type="checkbox" name="remember" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
        <span className="admin-check-box" aria-hidden="true">
          <svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" /></svg>
        </span>
        <span>
          Ingat saya
          <small>Tetap masuk 30 hari di perangkat ini</small>
        </span>
      </label>

      {state?.error ? (
        <motion.p className="admin-alert is-error" role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
          {state.error}
        </motion.p>
      ) : null}
      <button type="submit" className="admin-btn is-primary is-block is-shine" disabled={pending}>
        {pending ? <Loader2 aria-hidden="true" className="admin-spin" /> : <LogIn aria-hidden="true" />}
        {pending ? "Memeriksa…" : "Masuk"}
      </button>
    </form>
  )
}
