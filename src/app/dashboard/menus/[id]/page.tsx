import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import MenuForm from '@/components/MenuForm'
import type { Promo } from '@/lib/types'

export default async function EditMenuPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: promo } = await supabase
    .from('promos')
    .select('*')
    .eq('id', id)
    .eq('user_id', user!.id)
    .single()

  if (!promo) notFound()

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, margin: '0 0 4px' }}>Edit Client</h1>
        <p style={{ fontSize: 13, color: 'var(--sv-muted)', margin: 0 }}>{(promo as Promo).name}</p>
      </div>
      <MenuForm userId={user!.id} promo={promo as Promo} />
    </div>
  )
}
