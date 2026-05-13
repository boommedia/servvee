export type DesignSource = 'canva' | 'adobe' | 'url'

export interface Promo {
  id: string
  user_id: string
  name: string
  slot: string
  source: DesignSource
  design_id: string
  start_date: string | null  // 'YYYY-MM-DD' or null
  end_date: string | null
  is_active: boolean
  page_url: string
  created_at: string
}

export interface PromoFormData {
  name: string
  slot: string
  source: DesignSource
  design_id: string
  start_date: string
  end_date: string
  is_active: boolean
  page_url: string
}

// Derived status used in UI
export type PromoStatus = 'live' | 'scheduled' | 'default' | 'inactive'

export function promoStatus(p: Promo): PromoStatus {
  if (!p.is_active) return 'inactive'
  const today = new Date().toISOString().split('T')[0]
  if (p.start_date) {
    if (today >= p.start_date && today <= (p.end_date ?? '')) return 'live'
    return 'scheduled'
  }
  return 'default'
}

// Generate the Canva/Adobe embed URL from a promo
export function embedUrl(p: Pick<Promo, 'source' | 'design_id'>): string {
  if (p.source === 'canva') {
    return `https://www.canva.com/design/${p.design_id}/view?embed`
  }
  if (p.source === 'adobe') {
    return p.design_id.startsWith('http') ? p.design_id : `https://new.express.adobe.com/published-pages/share/${p.design_id}`
  }
  // PDF: wrap in Google Docs viewer for cross-device support (iOS, Android)
  if (p.design_id.toLowerCase().endsWith('.pdf') || p.design_id.toLowerCase().includes('/menu-pdfs/')) {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(p.design_id)}&embedded=true`
  }
  return p.design_id
}

// "Edit" deep-link back to the design tool
export function editUrl(p: Pick<Promo, 'source' | 'design_id'>): string {
  if (p.source === 'canva') {
    return `https://www.canva.com/design/${p.design_id}/edit`
  }
  if (p.source === 'adobe') {
    return 'https://new.express.adobe.com/'
  }
  return p.design_id
}

// Extract design ID from a pasted Canva / Adobe URL
export function parseDesignInput(raw: string): { source: DesignSource; design_id: string } {
  const trimmed = raw.trim()

  // Canva URL: https://www.canva.com/design/DAF.../...
  const canvaMatch = trimmed.match(/canva\.com\/design\/([A-Za-z0-9_-]+)/)
  if (canvaMatch) return { source: 'canva', design_id: canvaMatch[1] }

  // Adobe Express URL
  if (trimmed.includes('adobe.com') || trimmed.includes('express.adobe')) {
    return { source: 'adobe', design_id: trimmed }
  }

  // Looks like a raw Canva design ID (no slashes, no dots)
  if (/^[A-Za-z0-9_-]+$/.test(trimmed) && trimmed.length > 8) {
    return { source: 'canva', design_id: trimmed }
  }

  // Fallback: treat as a raw embed URL
  return { source: 'url', design_id: trimmed }
}

// ROI estimates
export function calcROI(promos: Promo[]) {
  const total   = promos.length
  const holiday = promos.filter(p => p.start_date !== null).length
  return {
    total,
    holiday,
    hoursSaved:  total * 4,          // ~4 hrs/month per menu managed
    revLow:      holiday * 250,      // conservative holiday revenue lift
    revHigh:     holiday * 750,
  }
}
