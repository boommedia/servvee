'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { Eye, EyeOff, Loader2, Check } from 'lucide-react'

export default function SignupPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [done, setDone]         = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      // Fire welcome email (best-effort — don't block on failure)
      fetch('/api/email/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName: email.split('@')[0] }),
      }).catch(() => {})
      setDone(true)
    }
  }

  const pwStrength = password.length === 0 ? 0
    : password.length < 8 ? 1
    : password.length < 12 && !/[^a-zA-Z0-9]/.test(password) ? 2
    : 3

  const strengthLabel = ['', 'Weak', 'Fair', 'Strong']
  const strengthColor = ['', 'var(--sv-danger)', 'var(--sv-warning)', 'var(--sv-success)']

  if (done) {
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--sv-bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}>
        <div style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <Check size={26} style={{ color: 'var(--sv-success)' }} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Check your email</h2>
          <p style={{ color: 'var(--sv-muted)', fontSize: 13, lineHeight: 1.6, marginBottom: 24 }}>
            We sent a confirmation link to <strong style={{ color: 'var(--sv-text)' }}>{email}</strong>.
            Click it to activate your account, then sign in.
          </p>
          <Link href="/login" className="btn btn-primary" style={{ display: 'inline-flex', justifyContent: 'center' }}>
            Go to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--sv-bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

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
          <p style={{ color: 'var(--sv-muted)', fontSize: 13, margin: 0 }}>
            Start your 14-day free trial — no credit card required
          </p>
        </div>

        {/* Tier teaser */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 24,
        }}>
          {[
            { name: 'Starter', price: '$29', color: '#A78BFA' },
            { name: 'Pro', price: '$79', color: 'var(--sv-accent)' },
            { name: 'Agency', price: '$199', color: 'var(--sv-warning)' },
          ].map(t => (
            <div key={t.name} style={{
              background: 'var(--sv-surface)', border: '1px solid var(--sv-border)',
              borderRadius: 8, padding: '10px', textAlign: 'center',
              borderTop: `2px solid ${t.color}`,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: t.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t.name}</div>
              <div style={{ fontSize: 16, fontWeight: 900, marginTop: 2 }}>{t.price}<span style={{ fontSize: 10, fontWeight: 400, color: 'var(--sv-muted)' }}>/mo</span></div>
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="card" style={{ padding: 28 }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label className="field-label">Work email</label>
              <input
                className="field-input"
                type="email"
                placeholder="you@restaurant.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div style={{ marginBottom: 22 }}>
              <label className="field-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="field-input"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={8}
                  style={{ paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--sv-muted)', display: 'flex', padding: 4,
                  }}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {/* Strength bar */}
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

            {error && (
              <div style={{
                background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)',
                borderRadius: 8, padding: '10px 14px', marginBottom: 16,
                fontSize: 12, color: 'var(--sv-danger)',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '11px 18px', fontSize: 14 }}
            >
              {loading ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : null}
              {loading ? 'Creating account…' : 'Create free account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: 'var(--sv-muted)', lineHeight: 1.5 }}>
            By signing up you agree to our{' '}
            <Link href="/terms" style={{ color: 'var(--sv-accent)', textDecoration: 'none' }}>Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" style={{ color: 'var(--sv-accent)', textDecoration: 'none' }}>Privacy Policy</Link>.
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--sv-muted)' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--sv-accent)', textDecoration: 'none', fontWeight: 700 }}>
            Sign in
          </Link>
        </p>

      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
