import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { calcROI, promoStatus } from '@/lib/types'
import type { Promo } from '@/lib/types'
import PromoCard from '@/components/PromoCard'
import { Plus, Calendar, Clock, TrendingUp, Briefcase, Copy } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data } = await supabase
    .from('promos')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
  const promos = data ?? []

  const typed    = promos as Promo[]
  const roi      = calcROI(typed)
  const live     = typed.filter(p => promoStatus(p) === 'live')
  const scheduled = typed.filter(p => promoStatus(p) === 'scheduled')
  const active   = typed.filter(p => p.is_active)

  const appUrl   = process.env.NEXT_PUBLIC_APP_URL ?? 'https://servvee.online'
  const firstName = user!.email?.split('@')[0] ?? 'there'

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 28, alignItems: 'start' }}>

      {/* ── Main column ── */}
      <div>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 4px' }}>
            Welcome back, {firstName} 👋
          </h1>
          <p style={{ fontSize: 13, color: 'var(--sv-muted)', margin: 0 }}>
            {typed.length === 0
              ? 'Add your first client to get started.'
              : `${active.length} active client${active.length !== 1 ? 's' : ''} · ${live.length > 0 ? `${live.length} holiday promo live now` : 'No holiday promos active'}`}
          </p>
        </div>

        {/* KPI cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            {
              label: 'Active Clients',
              val: active.length,
              icon: <Briefcase size={16} />,
              color: 'var(--sv-accent)',
              sub: `${typed.length} total`,
            },
            {
              label: 'Holiday Promos',
              val: roi.holiday,
              icon: <Calendar size={16} />,
              color: 'var(--sv-warning)',
              sub: scheduled.length > 0 ? `${scheduled.length} upcoming` : 'None scheduled',
            },
            {
              label: 'Hrs Saved / mo',
              val: `${roi.hoursSaved}h`,
              icon: <Clock size={16} />,
              color: '#60A5FA',
              sub: `~${roi.total * 4} hrs vs manual`,
            },
            {
              label: 'Est. Rev Lift',
              val: roi.holiday > 0 ? `$${roi.revLow.toLocaleString()}+` : '$0',
              icon: <TrendingUp size={16} />,
              color: 'var(--sv-success)',
              sub: roi.holiday > 0 ? `Up to $${roi.revHigh.toLocaleString()}` : 'Add holiday promos',
            },
          ].map(({ label, val, icon, color, sub }) => (
            <div key={label} className="card" style={{
              padding: '16px 18px', borderTop: `2px solid ${color}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 7,
                  background: `${color}18`, color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{icon}</div>
              </div>
              <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em', color, lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--sv-muted)', margin: '4px 0 2px' }}>{label}</div>
              <div style={{ fontSize: 10, color: 'var(--sv-muted)', opacity: 0.7 }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Live alert */}
        {live.length > 0 && (
          <div style={{
            background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.25)',
            borderRadius: 10, padding: '12px 16px', marginBottom: 20,
            display: 'flex', alignItems: 'center', gap: 10, fontSize: 13,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--sv-success)', flexShrink: 0, boxShadow: '0 0 6px var(--sv-success)' }} />
            <span style={{ color: 'var(--sv-success)', fontWeight: 700 }}>
              {live.length} holiday promo{live.length > 1 ? 's are' : ' is'} live right now
            </span>
            <span style={{ color: 'var(--sv-muted)' }}>—</span>
            <span style={{ color: 'var(--sv-muted)', fontSize: 12 }}>
              {live.map(p => p.name).join(', ')}
            </span>
          </div>
        )}

        {/* Menus list */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>Your Clients</h2>
          <Link href="/dashboard/menus/new" className="btn btn-primary btn-sm">
            <Plus size={12} /> Add Client
          </Link>
        </div>

        {typed.length === 0 ? (
          <div className="card" style={{ padding: '48px 32px', textAlign: 'center' }}>
            <div style={{ fontSize: 44, marginBottom: 14 }}>🍽</div>
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>No menus yet</h3>
            <p style={{ color: 'var(--sv-muted)', fontSize: 13, marginBottom: 24, maxWidth: 340, margin: '0 auto 24px' }}>
              Add your first client — upload a menu, ad, promo, or graphic using Canva, Adobe Express, or a direct file upload.
            </p>
            <Link href="/dashboard/menus/new" className="btn btn-primary">
              <Plus size={14} /> Add Your First Client
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {typed.slice(0, 8).map(p => (
              <PromoCard key={p.id} promo={p} userId={user!.id} />
            ))}
            {typed.length > 8 && (
              <Link href="/dashboard/menus" style={{
                textAlign: 'center', color: 'var(--sv-accent)', fontSize: 13,
                padding: 14, background: 'var(--sv-surface)', borderRadius: 10,
                border: '1px solid var(--sv-border)', textDecoration: 'none',
              }}>
                View all {typed.length} menus →
              </Link>
            )}
          </div>
        )}
      </div>

      {/* ── Sidebar ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Quick actions */}
        <div className="card">
          <div className="card-header">Quick Actions</div>
          <div style={{ padding: '12px' }}>
            {[
              { href: '/dashboard/menus/new', icon: <Plus size={13} />, label: 'Add new client', primary: true },
              { href: '/dashboard/menus', icon: <Briefcase size={13} />, label: 'Manage all clients', primary: false },
              { href: '/dashboard/settings', icon: <Copy size={13} />, label: 'Get embed snippet', primary: false },
            ].map(({ href, icon, label, primary }) => (
              <Link key={href} href={href} className={`btn ${primary ? 'btn-primary' : 'btn-ghost'}`} style={{
                width: '100%', justifyContent: 'flex-start', marginBottom: 6, fontSize: 12,
              }}>
                {icon} {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Embed base URL */}
        <div className="card">
          <div className="card-header">Your Embed URL</div>
          <div style={{ padding: '14px 16px' }}>
            <p style={{ fontSize: 11, color: 'var(--sv-muted)', marginBottom: 10, lineHeight: 1.5 }}>
              Add this iframe to any page on your website:
            </p>
            <div style={{
              background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)',
              borderRadius: 7, padding: '10px 12px', fontSize: 10,
              fontFamily: 'monospace', color: 'var(--sv-accent)',
              wordBreak: 'break-all', lineHeight: 1.7,
            }}>
              {`<iframe src="${appUrl}/embed/${user!.id}/default" width="100%" height="600" frameborder="0"></iframe>`}
            </div>
            <p style={{ fontSize: 10, color: 'var(--sv-muted)', marginTop: 8 }}>
              Replace <code style={{ color: 'var(--sv-accent)' }}>default</code> with your menu slot name.
            </p>
          </div>
        </div>

        {/* Design tips */}
        <div className="card">
          <div className="card-header">Design Studio Tips</div>
          <div style={{ padding: '14px 16px' }}>
            {[
              { icon: '🎨', text: 'Click "Add Menu" and choose Canva, Adobe Express, or import a PDF' },
              { icon: '✦',  text: 'Connect Canva once — then pick any design directly from your account' },
              { icon: '📄', text: 'Have an existing PDF menu? Drag and drop it to import instantly' },
              { icon: '⚡', text: 'Your menu goes live the moment you save — no manual updates needed' },
            ].map(({ icon, text }, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10, fontSize: 11 }}>
                <span style={{ fontSize: 14, flexShrink: 0, lineHeight: 1.3 }}>{icon}</span>
                <span style={{ color: 'var(--sv-muted)', lineHeight: 1.5 }}>{text}</span>
              </div>
            ))}
            <Link href="/dashboard/menus/new" className="btn btn-ghost btn-sm"
              style={{ width: '100%', justifyContent: 'center', marginTop: 6, fontSize: 11 }}>
              <Plus size={10} /> Create a menu
            </Link>
          </div>
        </div>

        {/* Upgrade nudge (only if on free or Starter) */}
        <div className="card" style={{ borderColor: 'var(--sv-accent-border)', background: 'var(--sv-accent-glow)' }}>
          <div style={{ padding: '16px' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--sv-accent)', marginBottom: 6 }}>
              ✦ Unlock holiday scheduling
            </div>
            <p style={{ fontSize: 11, color: 'var(--sv-muted)', lineHeight: 1.5, marginBottom: 12 }}>
              Set menus to go live on Valentine's Day, Christmas, or any custom date range — automatically.
            </p>
            <Link href="/dashboard/menus/new" className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center', fontSize: 11 }}>
              Add a holiday promo
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
