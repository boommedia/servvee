import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

const ALLOWED_TYPES: Record<string, string> = {
  'application/pdf': 'application/pdf',
  'image/jpeg':      'image/jpeg',
  'image/png':       'image/png',
  'image/webp':      'image/webp',
  'image/gif':       'image/gif',
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  if (!ALLOWED_TYPES[file.type]) {
    return NextResponse.json({ error: 'Unsupported file type. Use PDF, JPEG, PNG, WebP, or GIF.' }, { status: 400 })
  }
  if (file.size > 20 * 1024 * 1024) {
    return NextResponse.json({ error: 'File must be under 20 MB' }, { status: 400 })
  }

  const bytes  = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = `${user.id}/${Date.now()}-${safe}`

  const service = createServiceClient()
  const { error: uploadError } = await service.storage
    .from('menu-pdfs')
    .upload(path, buffer, { contentType: file.type, upsert: false })

  if (uploadError) {
    console.error('Storage upload error:', uploadError)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }

  const { data: { publicUrl } } = service.storage.from('menu-pdfs').getPublicUrl(path)

  return NextResponse.json({ url: publicUrl, path })
}
