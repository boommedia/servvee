import { createServiceClient } from '@/lib/supabase/server'
import { embedUrl } from '@/lib/types'
import type { Promo } from '@/lib/types'

interface Props {
  params: Promise<{ userId: string; slot: string }>
  searchParams: Promise<{ ratio?: string }>
}

export const dynamic = 'force-dynamic'  // always fresh for live scheduling

export default async function EmbedPage({ params, searchParams }: Props) {
  const { userId, slot } = await params
  const { ratio = 'landscape' } = await searchParams

  const supabase = createServiceClient()

  // Use the SQL function that applies holiday → standard priority
  const { data, error } = await supabase
    .rpc('resolve_active_promo', { p_user_id: userId, p_slot: slot })

  const promo = data?.[0] as Pick<Promo, 'source' | 'design_id' | 'name'> | undefined

  if (error || !promo) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', color: '#666', fontFamily: 'sans-serif', fontSize: 14,
        background: '#111',
      }}>
        No active menu found for this slot.
      </div>
    )
  }

  const url = embedUrl(promo)

  // Height / aspect ratio from ?ratio= param
  const height = ratio === 'portrait' ? '141.42vh'
               : ratio === 'square'   ? '100vw'
               : '56.25vw'

  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
      <iframe
        src={url}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        allowFullScreen
        allow="fullscreen"
        title={promo.name}
      />
    </div>
  )
}
