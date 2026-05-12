import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PromoCard from '@/components/PromoCard'
import type { Promo } from '@/lib/types'

export default async function MenusPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data } = await supabase
    .from('promos')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
  const promos = data ?? []

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, margin: '0 0 4px' }}>Menus &amp; Promos</h1>
          <p style={{ fontSize: 13, color: 'var(--sv-muted)', margin: 0 }}>
            {promos.length} total — standard menus and holiday overrides
          </p>
        </div>
        <Link href="/dashboard/menus/new" className="btn btn-primary">
          + Add Menu
        </Link>
      </div>

      {promos.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <p style={{ color: 'var(--sv-muted)', margin: '0 0 16px' }}>No menus yet.</p>
          <Link href="/dashboard/menus/new" className="btn btn-primary">Add Your First Menu</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(promos as Promo[]).map(p => (
            <PromoCard key={p.id} promo={p} userId={user!.id} />
          ))}
        </div>
      )}
    </div>
  )
}
