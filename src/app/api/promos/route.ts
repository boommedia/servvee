import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('promos')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ promos: data })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, slot, source, design_id, start_date, end_date, is_active, page_url } = body

  if (!name || !design_id) {
    return NextResponse.json({ error: 'name and design_id are required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('promos')
    .insert({
      user_id: user.id,
      name,
      slot:       slot       || 'default',
      source:     source     || 'canva',
      design_id,
      start_date: start_date || null,
      end_date:   end_date   || null,
      is_active:  is_active  ?? true,
      page_url:   page_url   || '',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ promo: data }, { status: 201 })
}
