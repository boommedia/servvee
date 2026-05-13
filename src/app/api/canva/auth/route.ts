import { NextResponse } from 'next/server'

export async function GET() {
  const clientId = process.env.CANVA_CLIENT_ID
  if (!clientId) {
    return NextResponse.json({ error: 'CANVA_CLIENT_ID not configured' }, { status: 500 })
  }

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/canva/callback`,
    scope: 'design:content:read design:meta:read',
  })

  return NextResponse.redirect(`https://www.canva.com/api/oauth/authorize?${params}`)
}
