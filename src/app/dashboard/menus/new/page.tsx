import { createClient } from '@/lib/supabase/server'
import MenuForm from '@/components/MenuForm'

export default async function NewMenuPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, margin: '0 0 4px' }}>Add Menu or Promo</h1>
        <p style={{ fontSize: 13, color: 'var(--sv-muted)', margin: 0 }}>
          Paste a Canva or Adobe Express design URL to get started
        </p>
      </div>
      <MenuForm userId={user!.id} />
    </div>
  )
}
