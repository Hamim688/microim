"use client"

import { useActionState } from "react"
import { changePassword, type FormState } from "../../actions"

export function PasswordForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(changePassword, undefined)
  return (
    <form action={action} className="admin-form" key={state?.success ? "reset" : "form"}>
      <label className="admin-field">
        <span>Password lama</span>
        <input name="current" type="password" autoComplete="current-password" required />
      </label>
      <label className="admin-field">
        <span>Password baru (min. 8 karakter)</span>
        <input name="next" type="password" autoComplete="new-password" minLength={8} required />
      </label>
      <label className="admin-field">
        <span>Ulangi password baru</span>
        <input name="confirm" type="password" autoComplete="new-password" minLength={8} required />
      </label>
      {state?.error ? <p className="admin-alert is-error" role="alert">{state.error}</p> : null}
      {state?.success ? <p className="admin-alert is-success" role="status">{state.success}</p> : null}
      <button type="submit" className="admin-btn is-primary" disabled={pending}>{pending ? "Menyimpan…" : "Simpan password"}</button>
    </form>
  )
}
