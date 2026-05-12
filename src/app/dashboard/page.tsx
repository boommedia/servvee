import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { calcROI, promoStatus } from '@/lib/types'
import type { Promo } from '@/lib/types'
import ROIWidget from '@/components/ROIWidget'
import PromoCard from '@/components/PromoCard'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: promos = [] } = await supabase
    .from('promos')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  const roi = calcROI(promos as Promo[])
  const live = (promos as Promo[]).filter(p => promoStatus(p) === 'live')

  return (
    <div>
      {/* ── Page header ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 28 }}>🍽</span>
          <h1 style={{
            fontSize: 26, fontWeight: 900, letterSpacing: '-0.03em', margin: 0,
            background: 'linear-gradient(135deg,#fff 0%,var(--sv-accent) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Servvee
          </h1>
          <span style={{
            fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
            background: 'var(--sv-accent-glow)', color: 'var(--sv-accent)',
            border: '1px solid var(--sv-accent-border)', borderRadius: 20, padding: '3px 10px',
          }}>
            BOOM B.A.A.R.S
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--sv-muted)', margin: 0 }}>
          Menu &amp; Promotion Manager — Canva + Adobe Live Embeds with smart scheduling
        </p>
      </div>

      {/* ── ROI Widget ── */}
      <ROIWidget roi={roi} />

      {/* ── Live now alert ── */}
      {live.length > 0 && (
        <div style={{
          background: 'rgba(74,222,128,0.08)',
          border: '1px solid rgba(74,222,128,0.25)',
          borderRadius: 'var(--sv-radius-sm)',
          padding: '12px 16px',
          marginBottom: 24,
          fontSize: 13,
          color: 'var(--sv-success)',
          fontWeight: 600,
        }}>
          🟢 {live.length} holiday promo{live.length > 1 ? 's are' : ' is'} live right now
        </div>
      )}

      {/* ── Recent promos ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>
          Your Menus &amp; Promos
        </h2>
        <Link href="/dashboard/menus/new" className="btn btn-primary btn-sm">
          + Add Menu
        </Link>
      </div>

      {promos.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🍽</div>
          <p style={{ color: 'var(--sv-muted)', marginBottom: 20 }}>
            No menus yet. Add your first Canva or Adobe Express design.
          </p>
          <Link href="/dashboard/menus/new" className="btn btn-primary">
            Add Your First Menu
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(promos as Promo[]).slice(0, 10).map(p => (
            <PromoCard key={p.id} promo={p} userId={user!.id} />
          ))}
          {promos.length > 10 && (
            <Link href="/dashboard/menus" style={{ textAlign: 'center', color: 'var(--sv-accent)', fontSize: 13 }}>
              View all {promos.length} menus →
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
