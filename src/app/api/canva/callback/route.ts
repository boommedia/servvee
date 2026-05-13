import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code  = searchParams.get('code')
  const error = searchParams.get('error')
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://servvee.online'

  if (error || !code) {
    return NextResponse.redirect(`${appUrl}/dashboard/menus/new?canva_error=1`)
  }

  // Exchange code for token
  const tokenRes = await fetch('https://api.canva.com/rest/v1/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: `${appUrl}/api/canva/callback`,
      client_id:     process.env.CANVA_CLIENT_ID!,
      client_secret: process.env.CANVA_CLIENT_SECRET!,
    }),
  })

  if (!tokenRes.ok) {
    return NextResponse.redirect(`${appUrl}/dashboard/menus/new?canva_error=1`)
  }

  const token = await tokenRes.json() as {
    access_token: string
    refresh_token?: string
    expires_in?: number
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(`${appUrl}/login`)

  const service = createServiceClient()
  await service.from('canva_tokens').upsert({
    user_id:       user.id,
    access_token:  token.access_token,
    refresh_token: token.refresh_token ?? null,
    expires_at:    token.expires_in
      ? new Date(Date.now() + token.expires_in * 1000).toISOString()
      : null,
    updated_at:    new Date().toISOString(),
  })

  return NextResponse.redirect(`${appUrl}/dashboard/menus/new?canva_connected=1`)
}
