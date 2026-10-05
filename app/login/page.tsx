"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Cpu,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Building2,
  KeyRound
} from "lucide-react"

export default function LoginPage() {
  const [roleTab, setRoleTab] = useState<"client" | "admin">("client")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    if (!email || !password) {
      setErrorMessage("Silakan isi surel dan kata sandi Anda.")
      return
    }

    setIsLoading(true)

    // Simulation of login action for frontend presentation
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
    }, 1200)
  }

  return (
    <div className="min-h-[calc(100vh-80px)] relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#071426]">
      {/* Background Circuit Grid & Glow Effects */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none hero-circuit-grid" />
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#FFC928]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-[#173359]/30 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-[#FFC928] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Beranda
          </Link>

          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC928] animate-pulse" />
            System Online
          </span>
        </div>

        {/* Login Card */}
        <div className="relative rounded-2xl bg-[#0c213d]/90 border border-[#173359] p-7 shadow-2xl backdrop-blur-xl">
          {/* Top Corner Technical Accent Borders */}
          <div className="absolute -top-px -left-px w-4 h-4 border-t-2 border-l-2 border-[#FFC928]" />
          <div className="absolute -bottom-px -right-px w-4 h-4 border-b-2 border-r-2 border-[#FFC928]" />

          {/* Card Header */}
          <div className="text-center space-y-3 mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#071426] border border-[#173359] shadow-inner mb-1">
              <Image
                src="/logo/logo-baru.png"
                alt="MikroIm Logo"
                width={36}
                height={36}
                priority
                className="rounded-xl"
              />
            </div>
            
            <div>
              <Badge variant="gold" className="text-[10px]">
                MikroIm Command Portal
              </Badge>
            </div>

            <h1 className="text-2xl font-bold text-white tracking-tight font-display">
              Masuk ke Akun Anda
            </h1>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Akses dasbor proyek IoT, katalog komponen, dan layanan rekayasa MikroIm.
            </p>
          </div>

          {/* Role Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#071426] rounded-xl border border-[#173359] mb-6">
            <button
              type="button"
              onClick={() => {
                setRoleTab("client")
                setErrorMessage("")
              }}
              className={`flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg transition-all ${
                roleTab === "client"
                  ? "bg-[#0c213d] text-[#FFC928] border border-[#FFC928]/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Pelanggan / Mitra</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRoleTab("admin")
                setErrorMessage("")
              }}
              className={`flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg transition-all ${
                roleTab === "admin"
                  ? "bg-[#0c213d] text-[#FFC928] border border-[#FFC928]/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Tim &amp; Insinyur</span>
            </button>
          </div>

          {/* Success Notification View */}
          {isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">Autentikasi Berhasil!</h3>
              <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                Selamat datang kembali. Anda masuk sebagai{" "}
                <span className="text-[#FFC928] font-semibold">
                  {roleTab === "admin" ? "Insinyur / Admin" : "Pelanggan / Mitra"}
                </span>.
              </p>
              <div className="pt-2">
                <Button
                  onClick={() => {
                    setIsSuccess(false)
                    setEmail("")
                    setPassword("")
                  }}
                  variant="secondary"
                  size="sm"
                  className="w-full"
                >
                  Masuk Kembali
                </Button>
              </div>
            </div>
          ) : (
            /* Login Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Alert */}
              {errorMessage && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Surel / Email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder={
                      roleTab === "admin"
                        ? "engineer@mikroim.com"
                        : "nama@perusahaan.com"
                    }
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#071426] border border-[#173359] text-white text-sm placeholder-slate-500 focus:outline-none focus:border-[#FFC928] focus:ring-1 focus:ring-[#FFC928] transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Kata Sandi *
                  </label>
                  <a
                    href="#forgot-password"
                    onClick={(e) => {
                      e.preventDefault()
                      alert(
                        "Silakan hubungi tim administrator MikroIm melalui kontak untuk penyetelan ulang kata sandi."
                      )
                    }}
                    className="text-[11px] text-[#FFC928] hover:underline"
                  >
                    Lupa Kata Sandi?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#071426] border border-[#173359] text-white text-sm placeholder-slate-500 focus:outline-none focus:border-[#FFC928] focus:ring-1 focus:ring-[#FFC928] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Checkbox Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#071426] border-[#173359] text-[#FFC928] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#FFC928]"
                  />
                  <span className="text-xs text-slate-300">
                    Ingat Sesi Saya
                  </span>
                </label>
                
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-[#FFC928]" />
                  256-bit SSL
                </span>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-[#071426] border-t-transparent rounded-full animate-spin" />
                      <span>Memverifikasi Sesi...</span>
                    </>
                  ) : (
                    <>
                      <span>Masuk Portal {roleTab === "admin" ? "Admin" : "Mitra"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>

              {/* Divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#173359]" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-mono">
                  <span className="bg-[#0c213d] px-3 text-slate-400">
                    Atau Masuk Dengan
                  </span>
                </div>
              </div>

              {/* Third-party / SSO options */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    alert("Autentikasi SSO Google diaktifkan untuk mitra terverifikasi.")
                  }
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#071426] border border-[#173359] text-xs font-medium text-slate-300 hover:text-white hover:border-[#FFC928]/40 transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9c-.6-1.5-.9-3.2-.9-5z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                    />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    alert("Autentikasi SSO GitHub diaktifkan untuk pengembang & insinyur.")
                  }
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#071426] border border-[#173359] text-xs font-medium text-slate-300 hover:text-white hover:border-[#FFC928]/40 transition-all"
                >
                  <KeyRound className="w-4 h-4 text-[#FFC928]" />
                  <span>Teknisi SSO</span>
                </button>
              </div>
            </form>
          )}

          {/* Footer Card Info */}
          <div className="mt-6 pt-5 border-t border-[#173359]/60 text-center">
            <p className="text-xs text-slate-400">
              Belum memiliki akun terdaftar?{" "}
              <Link
                href="/contact"
                className="text-[#FFC928] font-semibold hover:underline inline-flex items-center gap-1"
              >
                Pengajuan Akun Mitra
              </Link>
            </p>
          </div>
        </div>

        {/* Security & System Status */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 px-2">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Enkripsi Terverifikasi
          </span>
          <span>MikroIm Security v2.4</span>
        </div>
      </div>
    </div>
  )
}
