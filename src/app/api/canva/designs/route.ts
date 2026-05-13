import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

interface CanvaDesignItem {
  id: string
  title?: string
  thumbnail?: { url: string }
  updated_at?: number
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const service = createServiceClient()
  const { data: tokenRow } = await service
    .from('canva_tokens')
    .select('access_token, expires_at')
    .eq('user_id', user.id)
    .single()

  if (!tokenRow) return NextResponse.json({ error: 'Not connected' }, { status: 401 })

  const res = await fetch('https://api.canva.com/rest/v1/designs?ownership=owned&limit=50', {
    headers: { Authorization: `Bearer ${tokenRow.access_token}` },
    cache: 'no-store',
  })

  if (res.status === 401) {
    // Stale token — remove it so the UI shows reconnect
    await service.from('canva_tokens').delete().eq('user_id', user.id)
    return NextResponse.json({ error: 'Token expired' }, { status: 401 })
  }

  if (!res.ok) return NextResponse.json({ error: 'Canva API error' }, { status: 502 })

  const data = await res.json() as { items?: CanvaDesignItem[] }
  const designs = (data.items ?? []).map(d => ({
    id:         d.id,
    title:      d.title ?? 'Untitled',
    thumbnail:  d.thumbnail?.url ?? null,
    updated_at: d.updated_at ? new Date(d.updated_at * 1000).toISOString() : '',
  }))

  return NextResponse.json({ designs })
}
