'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword]     = useState('')
  const [confirm, setConfirm]       = useState('')
  const [showPw, setShowPw]         = useState(false)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')
  const [done, setDone]             = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const pwStrength = password.length === 0 ? 0
    : password.length < 8 ? 1
    : password.length < 12 && !/[^a-zA-Z0-9]/.test(password) ? 2
    : 3
  const strengthLabel = ['', 'Weak', 'Fair', 'Strong']
  const strengthColor = ['', 'var(--sv-danger)', 'var(--sv-warning)', 'var(--sv-success)']

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) { setError(error.message); return }

    setDone(true)
    setTimeout(() => router.push('/dashboard'), 2000)
  }

  if (done) {
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--sv-bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}>
        <div style={{ textAlign: 'center', maxWidth: 360 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
          }}>
            <CheckCircle size={26} style={{ color: 'var(--sv-success)' }} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Password updated</h2>
          <p style={{ fontSize: 13, color: 'var(--sv-muted)' }}>Redirecting you to the dashboard…</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--sv-bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 380 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'linear-gradient(135deg, var(--sv-accent), var(--sv-accent-2))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, fontWeight: 900, color: '#fff',
            }}>S</div>
            <span style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.5px' }}>
              Serv<span style={{ color: 'var(--sv-accent)' }}>vee</span>
            </span>
          </div>
          <p style={{ color: 'var(--sv-muted)', fontSize: 13, margin: 0 }}>Choose a new password</p>
        </div>

        <div className="card" style={{ padding: 28 }}>
          <form onSubmit={handleSubmit}>

            <div style={{ marginBottom: 18 }}>
              <label className="field-label">New password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="field-input"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required minLength={8}
                  style={{ paddingRight: 40 }}
                  autoFocus
                />
                <button type="button" onClick={() => setShowPw(v => !v)} style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--sv-muted)', display: 'flex', padding: 4,
                }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {password.length > 0 && (
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 3, background: 'var(--sv-border)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 2,
                      width: `${(pwStrength / 3) * 100}%`,
                      background: strengthColor[pwStrength],
                      transition: 'width 0.2s, background 0.2s',
                    }} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: strengthColor[pwStrength] }}>
                    {strengthLabel[pwStrength]}
                  </span>
                </div>
              )}
            </div>

            <div style={{ marginBottom: 22 }}>
              <label className="field-label">Confirm password</label>
              <input
                className="field-input"
                type={showPw ? 'text' : 'password'}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Repeat your new password"
                required
              />
              {confirm.length > 0 && confirm !== password && (
                <p style={{ fontSize: 11, color: 'var(--sv-danger)', marginTop: 5 }}>Passwords do not match</p>
              )}
            </div>

            {error && (
              <div style={{
                background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)',
                borderRadius: 8, padding: '10px 14px', marginBottom: 16,
                fontSize: 12, color: 'var(--sv-danger)',
              }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '11px 18px', fontSize: 14 }}>
              {loading ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : null}
              {loading ? 'Updating…' : 'Set new password'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--sv-muted)' }}>
          Remembered it?{' '}
          <Link href="/login" style={{ color: 'var(--sv-accent)', textDecoration: 'none', fontWeight: 700 }}>
            Sign in
          </Link>
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
