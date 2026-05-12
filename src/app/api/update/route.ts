import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

/**
 * POST /api/update
 * Remote push endpoint — update a menu's design ID by slot.
 * Used by Make.com automations, watcher scripts, and direct API calls.
 *
 * Auth: X-Servvee-Key header  (stored in env SERVVEE_API_KEY)
 * Body: { user_id, slot, design_id, source? }
 */
export async function POST(req: NextRequest) {
  const key = req.headers.get('X-Servvee-Key')
  if (!key || key !== process.env.SERVVEE_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const { user_id, slot, design_id, source = 'canva', name } = body

  if (!user_id || !slot || !design_id) {
    return NextResponse.json({ error: 'user_id, slot, and design_id are required' }, { status: 400 })
  }

  const supabase = createServiceClient()

  // Find existing standard (no-date) promo for this user+slot
  const { data: existing } = await supabase
    .from('promos')
    .select('id')
    .eq('user_id', user_id)
    .eq('slot', slot)
    .is('start_date', null)
    .limit(1)
    .single()

  let result
  if (existing) {
    const { data, error } = await supabase
      .from('promos')
      .update({ design_id, source, is_active: true, ...(name ? { name } : {}) })
      .eq('id', existing.id)
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    result = { action: 'updated', promo: data }
  } else {
    const { data, error } = await supabase
      .from('promos')
      .insert({
        user_id, slot, design_id, source, is_active: true,
        name: name ?? `Menu (${slot})`,
        start_date: null, end_date: null, page_url: '',
      })
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    result = { action: 'created', promo: data }
  }

  return NextResponse.json({ success: true, ...result })
}
