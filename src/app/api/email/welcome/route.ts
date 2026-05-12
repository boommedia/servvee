import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { welcomeEmail } from '@/emails/welcome'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const { email, firstName } = await req.json() as { email: string; firstName: string }

  if (!email) {
    return NextResponse.json({ error: 'email required' }, { status: 400 })
  }

  const { error } = await resend.emails.send({
    from: 'Servvee <hello@servvee.online>',
    to: email,
    subject: 'Welcome to Servvee — your menu manager is ready',
    html: welcomeEmail({ firstName: firstName || email.split('@')[0] }),
  })

  if (error) {
    console.error('Resend welcome email error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
