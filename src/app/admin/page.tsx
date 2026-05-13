import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import type { Promo } from '@/lib/types'
import { promoStatus } from '@/lib/types'
import { Shield } from 'lucide-react'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? 'eric@boommedia.us').split(',')


export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !ADMIN_EMAILS.includes(user.email ?? '')) redirect('/dashboard')

  const service = createServiceClient()

  // All users
  const { data: { users } } = await service.auth.admin.listUsers({ perPage: 1000 })

  // All promos
  const { data: promos } = await service.from('promos').select('*').order('created_at', { ascending: false })
  const allPromos = (promos ?? []) as Promo[]

  // Metrics
  const totalUsers    = users.length
  const activePromos  = allPromos.filter(p => p.is_active).length
  const holidayPromos = allPromos.filter(p => p.start_date !== null).length
  const liveNow       = allPromos.filter(p => promoStatus(p) === 'live').length

  // Estimated MRR (assume all Starter until Stripe is wired)
  const estMRR = totalUsers * 29

  // Promos per user distribution
  const promosByUser: Record<string, number> = {}
  allPromos.forEach(p => { promosByUser[p.user_id] = (promosByUser[p.user_id] ?? 0) + 1 })
  const usersWithPromos = Object.keys(promosByUser).length
  const avgPromosPerUser = usersWithPromos > 0
    ? (allPromos.length / usersWithPromos).toFixed(1)
    : '0'

  // Recent users (last 10)
  const recentUsers = [...users]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10)

  // Recent promos (last 8)
  const recentPromos = allPromos.slice(0, 8)

  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 30) return `${days}d ago`
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9,
          background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sv-danger)',
        }}>
          <Shield size={16} />
        </div>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 900, margin: '0 0 2px', letterSpacing: '-0.02em' }}>Admin Dashboard</h1>
          <p style={{ fontSize: 11, color: 'var(--sv-muted)', margin: 0 }}>Platform overview · {user.email}</p>
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Total Users',      val: totalUsers,                    color: 'var(--sv-accent)' },
          { label: 'Est. MRR',         val: `$${estMRR.toLocaleString()}`, color: 'var(--sv-success)' },
          { label: 'ARPU',             val: `$${totalUsers ? (estMRR / totalUsers).toFixed(2) : '0'}`, color: 'var(--sv-warning)' },
          { label: 'Total Promos',     val: allPromos.length,              color: '#60A5FA' },
          { label: 'Live Holiday Now', val: liveNow,                       color: 'var(--sv-danger)' },
        ].map(({ label, val, color }) => (
          <div key={label} className="card" style={{ padding: '16px 18px', borderTop: `2px solid ${color}` }}>
            <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em', color, lineHeight: 1 }}>{val}</div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--sv-muted)', marginTop: 6 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Secondary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Active Promos',      val: activePromos },
          { label: 'Holiday Promos',     val: holidayPromos },
          { label: 'Users w/ Promos',    val: `${usersWithPromos} / ${totalUsers}` },
          { label: 'Avg Promos / User',  val: avgPromosPerUser },
        ].map(({ label, val }) => (
          <div key={label} className="card" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: 'var(--sv-muted)', fontWeight: 600 }}>{label}</span>
            <span style={{ fontSize: 18, fontWeight: 900 }}>{val}</span>
          </div>
        ))}
      </div>

      {/* Two-column: recent users + recent promos */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>

        {/* Recent users */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="card-header">Recent Signups</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--sv-surface-2)' }}>
                {['Email', 'Joined', 'Promos'].map(h => (
                  <th key={h} style={{
                    padding: '8px 14px', textAlign: 'left',
                    fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.07em', color: 'var(--sv-muted)',
                    borderBottom: '1px solid var(--sv-border)',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentUsers.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--sv-border)' }}>
                  <td style={{ padding: '9px 14px', fontSize: 12, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {u.email}
                  </td>
                  <td style={{ padding: '9px 14px', fontSize: 11, color: 'var(--sv-muted)', whiteSpace: 'nowrap' }}>
                    {timeAgo(u.created_at)}
                  </td>
                  <td style={{ padding: '9px 14px', fontSize: 12, textAlign: 'right' }}>
                    <span style={{
                      display: 'inline-block', padding: '1px 8px', borderRadius: 4,
                      fontSize: 11, fontWeight: 700,
                      background: (promosByUser[u.id] ?? 0) > 0 ? 'var(--sv-accent-glow)' : 'var(--sv-surface-2)',
                      color: (promosByUser[u.id] ?? 0) > 0 ? 'var(--sv-accent)' : 'var(--sv-muted)',
                      border: `1px solid ${(promosByUser[u.id] ?? 0) > 0 ? 'var(--sv-accent-border)' : 'var(--sv-border)'}`,
                    }}>
                      {promosByUser[u.id] ?? 0}
                    </span>
                  </td>
                </tr>
              ))}
              {recentUsers.length === 0 && (
                <tr><td colSpan={3} style={{ padding: '20px 14px', textAlign: 'center', fontSize: 12, color: 'var(--sv-muted)' }}>No users yet</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Recent promos */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="card-header">Recent Promos (All Users)</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--sv-surface-2)' }}>
                {['Name', 'Source', 'Status', 'Created'].map(h => (
                  <th key={h} style={{
                    padding: '8px 14px', textAlign: 'left',
                    fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.07em', color: 'var(--sv-muted)',
                    borderBottom: '1px solid var(--sv-border)',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentPromos.map(p => {
                const status = promoStatus(p)
                const statusColor = status === 'live' ? 'var(--sv-success)' : status === 'scheduled' ? 'var(--sv-warning)' : status === 'inactive' ? 'var(--sv-danger)' : 'var(--sv-muted)'
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--sv-border)' }}>
                    <td style={{ padding: '9px 14px', fontSize: 12, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.name}
                    </td>
                    <td style={{ padding: '9px 14px' }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                        background: 'var(--sv-surface-2)', color: 'var(--sv-muted)',
                        border: '1px solid var(--sv-border)',
                      }}>{p.source}</span>
                    </td>
                    <td style={{ padding: '9px 14px' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: statusColor }}>{status}</span>
                    </td>
                    <td style={{ padding: '9px 14px', fontSize: 11, color: 'var(--sv-muted)', whiteSpace: 'nowrap' }}>
                      {timeAgo(p.created_at)}
                    </td>
                  </tr>
                )
              })}
              {recentPromos.length === 0 && (
                <tr><td colSpan={4} style={{ padding: '20px 14px', textAlign: 'center', fontSize: 12, color: 'var(--sv-muted)' }}>No promos yet</td></tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* MRR breakdown by tier estimate */}
      <div className="card" style={{ overflow: 'hidden', marginBottom: 20 }}>
        <div className="card-header">Revenue Projection (Estimated — wire Stripe for actuals)</div>
        <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {[
            { tier: 'Starter', price: 29, pct: 70, color: '#A78BFA' },
            { tier: 'Pro',     price: 79, pct: 22, color: 'var(--sv-accent)' },
            { tier: 'Agency',  price: 199, pct: 8, color: 'var(--sv-warning)' },
          ].map(({ tier, price, pct, color }) => {
            const count = Math.round((totalUsers * pct) / 100)
            const mrr   = count * price
            return (
              <div key={tier}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12 }}>
                  <span style={{ fontWeight: 700, color }}>{tier}</span>
                  <span style={{ color: 'var(--sv-muted)' }}>${price}/mo · ~{pct}% mix</span>
                </div>
                <div style={{ height: 6, background: 'var(--sv-surface-2)', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--sv-muted)' }}>
                  <span>~{count} users</span>
                  <span style={{ fontWeight: 700, color }}>${mrr.toLocaleString()}/mo</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <p style={{ fontSize: 11, color: 'var(--sv-muted)', textAlign: 'center' }}>
        Admin access: {ADMIN_EMAILS.join(', ')} · Add emails via <code style={{ color: 'var(--sv-accent)', fontSize: 10 }}>ADMIN_EMAILS</code> env var
      </p>
    </div>
  )
}
