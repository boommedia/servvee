import { createClient } from '@/lib/supabase/server'
import MenuForm from '@/components/MenuForm'

export default async function NewMenuPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, margin: '0 0 4px' }}>Add Client</h1>
        <p style={{ fontSize: 13, color: 'var(--sv-muted)', margin: 0 }}>
          Create with Canva, Adobe Express, upload a file, or paste any URL
        </p>
      </div>
      <MenuForm userId={user!.id} />
    </div>
  )
}
