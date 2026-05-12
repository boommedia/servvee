import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Settings } from 'lucide-react'
import CopyButton from '@/components/CopyButton'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const embedBase = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://servvee.online'}/embed/${user.id}`

  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
        <Settings size={20} style={{ color: 'var(--sv-accent)' }} />
        <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Settings</h1>
      </div>

      {/* Account */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">Account</div>
        <div style={{ padding: '18px 20px' }}>
          <div style={{ marginBottom: 14 }}>
            <div className="field-label">Email</div>
            <div style={{
              padding: '9px 12px', background: 'var(--sv-surface-2)',
              border: '1px solid var(--sv-border)', borderRadius: 'var(--sv-radius-sm)',
              fontSize: 13, color: 'var(--sv-muted)',
            }}>
              {user.email}
            </div>
          </div>
          <div>
            <div className="field-label">User ID</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                flex: 1, padding: '9px 12px', background: 'var(--sv-surface-2)',
                border: '1px solid var(--sv-border)', borderRadius: 'var(--sv-radius-sm)',
                fontSize: 12, color: 'var(--sv-muted)', fontFamily: 'monospace',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {user.id}
              </div>
              <CopyButton text={user.id} label="Copy ID" />
            </div>
            <p className="field-hint">Your user ID is used in all embed URLs.</p>
          </div>
        </div>
      </div>

      {/* Embed info */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">Embed Base URL</div>
        <div style={{ padding: '18px 20px' }}>
          <p style={{ fontSize: 12, color: 'var(--sv-muted)', marginBottom: 12, lineHeight: 1.6 }}>
            Add <code style={{ background: 'var(--sv-surface-2)', padding: '1px 5px', borderRadius: 4, fontSize: 11 }}>/SLOT_NAME</code> to
            the base URL below to embed any of your menus on any website.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              flex: 1, padding: '9px 12px', background: 'var(--sv-surface-2)',
              border: '1px solid var(--sv-border)', borderRadius: 'var(--sv-radius-sm)',
              fontSize: 12, color: 'var(--sv-muted)', fontFamily: 'monospace',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {embedBase}
            </div>
            <CopyButton text={embedBase} label="Copy URL" />
          </div>
          <div style={{
            marginTop: 14, padding: '12px 14px',
            background: 'var(--sv-surface-2)', borderRadius: 8,
            border: '1px solid var(--sv-border)',
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--sv-muted)', marginBottom: 6 }}>
              Example iframe snippet
            </div>
            <code style={{ fontSize: 11, color: 'var(--sv-text)', lineHeight: 1.7, display: 'block', wordBreak: 'break-all' }}>
              {`<iframe src="${embedBase}/default" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`}
            </code>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="card" style={{ borderColor: 'rgba(248,113,113,0.2)' }}>
        <div className="card-header" style={{ color: 'var(--sv-danger)', borderColor: 'rgba(248,113,113,0.2)' }}>Danger Zone</div>
        <div style={{ padding: '18px 20px' }}>
          <p style={{ fontSize: 12, color: 'var(--sv-muted)', marginBottom: 12, lineHeight: 1.6 }}>
            Deleting your account is permanent and will remove all menus, promos, and embed data immediately.
          </p>
          <button className="btn btn-danger btn-sm" disabled style={{ cursor: 'not-allowed', opacity: 0.5 }}>
            Delete account
          </button>
          <span style={{ fontSize: 11, color: 'var(--sv-muted)', marginLeft: 10 }}>Contact support to delete your account.</span>
        </div>
      </div>
    </div>
  )
}
