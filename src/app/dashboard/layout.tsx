import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Nav from '@/components/Nav'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--sv-bg)' }}>
      <Nav user={user} />
      <main style={{ flex: 1, padding: '28px 32px', minWidth: 0 }}>
        {children}
      </main>
    </div>
  )
}
