'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, UtensilsCrossed, Settings, LogOut, Shield } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? 'eric@boommedia.us').split(',')

const BASE_NAV = [
  { href: '/dashboard',          label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/menus',    label: 'Menus',    icon: UtensilsCrossed },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function Nav({ user }: { user: User }) {
  const path    = usePathname()
  const router  = useRouter()
  const isAdmin = ADMIN_EMAILS.includes(user.email ?? '')
  const NAV_ITEMS = isAdmin
    ? [...BASE_NAV, { href: '/admin', label: 'Admin', icon: Shield }]
    : BASE_NAV

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside style={{
      width: 220,
      flexShrink: 0,
      background: 'var(--sv-surface)',
      borderRight: '1px solid var(--sv-border)',
      padding: '24px 0',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }}>
      {/* Logo */}
      <div style={{ padding: '0 20px 24px', borderBottom: '1px solid var(--sv-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 22 }}>🍽</span>
          <span style={{
            fontSize: 18, fontWeight: 900, letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg,#fff 0%,var(--sv-accent) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Servvee
          </span>
        </div>
        <span style={{
          fontSize: 9, fontWeight: 800, letterSpacing: '0.1em',
          color: 'var(--sv-accent)', textTransform: 'uppercase',
        }}>
          BOOM B.A.A.R.S
        </span>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = path === href || (href !== '/dashboard' && path.startsWith(href))
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 8,
              fontSize: 13, fontWeight: active ? 700 : 500,
              color: active ? 'var(--sv-accent)' : 'var(--sv-muted)',
              background: active ? 'var(--sv-accent-glow)' : 'transparent',
              border: `1px solid ${active ? 'var(--sv-accent-border)' : 'transparent'}`,
              textDecoration: 'none', marginBottom: 4,
              transition: 'all 0.15s',
            }}>
              <Icon size={15} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User + sign out */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid var(--sv-border)' }}>
        <div style={{
          fontSize: 11, color: 'var(--sv-muted)', marginBottom: 10,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          padding: '0 4px',
        }}>
          {user.email}
        </div>
        <button onClick={handleSignOut} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          width: '100%', padding: '8px 12px', borderRadius: 8,
          fontSize: 12, fontWeight: 600, cursor: 'pointer',
          background: 'transparent', border: '1px solid var(--sv-border)',
          color: 'var(--sv-muted)', transition: 'all 0.15s',
        }}>
          <LogOut size={13} /> Sign out
        </button>
      </div>
    </aside>
  )
}
