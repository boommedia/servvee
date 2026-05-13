'use client'

import { useState, useEffect, useTransition, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ExternalLink, Eye, Wand2, Images, FileUp } from 'lucide-react'
import { parseDesignInput, embedUrl, editUrl } from '@/lib/types'
import type { Promo, PromoFormData, DesignSource } from '@/lib/types'
import CopyButton from './CopyButton'
import dynamic from 'next/dynamic'

// Loaded only when needed — keeps the main bundle small
const AdobeExpressEditor = dynamic(() => import('./AdobeExpressEditor'), { ssr: false })
const CanvaDesignPicker  = dynamic(() => import('./CanvaDesignPicker'),  { ssr: false })
const PDFUploader        = dynamic(() => import('./PDFUploader'),        { ssr: false })

interface Props {
  userId: string
  promo?: Promo
}

const SOURCE_LABELS: Record<DesignSource, { label: string; icon: string; placeholder: string }> = {
  canva:  { label: 'Canva',         icon: '🎨', placeholder: 'Paste Canva URL or Design ID (e.g. DAF1234567890)' },
  adobe:  { label: 'Adobe Express', icon: '✦',  placeholder: 'Paste Adobe Express published page URL' },
  url:    { label: 'Direct URL',    icon: '🔗',  placeholder: 'Paste any embeddable URL' },
}

export default function MenuForm({ userId, promo }: Props) {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()
  const [error, setError]          = useState('')
  const [toast, setToast]          = useState('')

  // Design studio modals / panels
  const [showAdobe, setShowAdobe] = useState(false)
  const [showCanva, setShowCanva] = useState(false)
  const [showPDF,   setShowPDF]   = useState(false)

  const [form, setForm] = useState<PromoFormData>({
    name:       promo?.name       ?? '',
    slot:       promo?.slot       ?? 'default',
    source:     promo?.source     ?? 'canva',
    design_id:  promo?.design_id  ?? '',
    start_date: promo?.start_date ?? '',
    end_date:   promo?.end_date   ?? '',
    is_active:  promo?.is_active  ?? true,
    page_url:   promo?.page_url   ?? '',
  })

  const [rawInput, setRawInput]     = useState(
    promo ? (promo.source === 'canva'
      ? `https://www.canva.com/design/${promo.design_id}/edit`
      : promo.design_id)
    : ''
  )
  const [previewKey, setPreviewKey] = useState(0)
  const [showDates, setShowDates]   = useState(!!promo?.start_date)
  const [slotManual, setSlotManual] = useState(!!promo)

  // Toast from OAuth callbacks
  useEffect(() => {
    if (searchParams.get('canva_connected') === '1') {
      setToast('Canva connected! Browse your designs below.')
      setShowCanva(true)
    }
    if (searchParams.get('canva_error') === '1') {
      setError('Canva connection failed. Please try again.')
    }
  }, [searchParams])

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 4000)
    return () => clearTimeout(t)
  }, [toast])

  // Auto-slug slot from name
  useEffect(() => {
    if (slotManual) return
    const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    setForm(f => ({ ...f, slot: slug || 'default' }))
  }, [form.name, slotManual])

  function handleDesignInput(raw: string) {
    setRawInput(raw)
    if (!raw.trim()) return
    const parsed = parseDesignInput(raw)
    setForm(f => ({ ...f, source: parsed.source, design_id: parsed.design_id }))
  }

  // Called when Adobe Express publishes — auto-fill the URL
  const handleAdobeComplete = useCallback((url: string) => {
    setShowAdobe(false)
    setRawInput(url)
    setForm(f => ({ ...f, source: 'adobe', design_id: url }))
    setPreviewKey(k => k + 1)
    setToast('Design saved from Adobe Express!')
  }, [])

  // Called when PDF is uploaded — auto-fill URL, optionally open Adobe to edit
  const handlePDFComplete = useCallback((url: string, suggestedName: string) => {
    setRawInput(url)
    setForm(f => ({ ...f, source: 'url', design_id: url, name: f.name || suggestedName }))
    setPreviewKey(k => k + 1)
    setToast('PDF uploaded! Preview updated below.')
  }, [])

  const handlePDFEditInAdobe = useCallback((pdfUrl: string) => {
    // Close PDF panel, store URL, open Adobe Express for editing
    handlePDFComplete(pdfUrl, '')
    setShowPDF(false)
    setShowAdobe(true)
  }, [handlePDFComplete])

  // Called when user picks a Canva design
  const handleCanvaSelect = useCallback((designId: string, title: string) => {
    setShowCanva(false)
    const raw = `https://www.canva.com/design/${designId}/edit`
    setRawInput(raw)
    setForm(f => ({
      ...f,
      source:    'canva',
      design_id: designId,
      name:      f.name || title,
    }))
    setPreviewKey(k => k + 1)
    setToast(`"${title}" selected from Canva!`)
  }, [])

  const currentEmbedUrl = form.design_id ? embedUrl({ source: form.source, design_id: form.design_id }) : ''
  const currentEditUrl  = form.design_id ? editUrl({ source: form.source, design_id: form.design_id }) : ''
  const appUrl          = process.env.NEXT_PUBLIC_APP_URL ?? 'https://servvee.online'
  const iframeSnippet   = `<iframe src="${appUrl}/embed/${userId}/${form.slot}" style="width:100%;height:600px;border:none;" allowfullscreen loading="lazy"></iframe>`

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name || !form.design_id) { setError('Name and design are required.'); return }
    startTransition(async () => {
      const res = await fetch(
        promo ? `/api/promos/${promo.id}` : '/api/promos',
        {
          method: promo ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, start_date: form.start_date || null, end_date: form.end_date || null }),
        }
      )
      if (!res.ok) {
        const d = await res.json().catch(() => ({})) as { error?: string }
        setError(d.error ?? 'Something went wrong.')
        return
      }
      router.push('/dashboard/menus')
      router.refresh()
    })
  }

  return (
    <>
      {/* Modals */}
      {showAdobe && (
        <AdobeExpressEditor
          onComplete={handleAdobeComplete}
          onClose={() => setShowAdobe(false)}
        />
      )}
      {showCanva && (
        <CanvaDesignPicker
          onSelect={handleCanvaSelect}
          onClose={() => setShowCanva(false)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 999,
          background: 'var(--sv-surface)', border: '1px solid var(--sv-accent-border)',
          borderRadius: 10, padding: '12px 18px', fontSize: 13, fontWeight: 600,
          color: 'var(--sv-accent)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          animation: 'slideUp 0.2s ease',
        }}>
          {toast}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 24, alignItems: 'start' }}>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="card" style={{ overflow: 'hidden' }}>
          <div className="card-header">{promo ? 'Edit' : 'New'} Client</div>
          <div style={{ padding: '20px 20px 24px' }}>

            {error && (
              <div style={{
                background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)',
                borderRadius: 8, padding: '10px 14px', marginBottom: 16,
                fontSize: 13, color: 'var(--sv-danger)',
              }}>
                {error}
              </div>
            )}

            {/* ── Design studio buttons ── */}
            <div style={{ marginBottom: 16 }}>
              <label className="field-label">Design Studio</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                <button type="button"
                  onClick={() => setShowAdobe(true)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    padding: '10px 10px', borderRadius: 9, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                    border: '1px solid rgba(255,0,0,0.3)', background: 'rgba(255,0,0,0.07)',
                    color: '#FF6B6B', transition: 'all 0.15s',
                  }}>
                  <Wand2 size={12} />
                  Adobe Express
                </button>
                <button type="button"
                  onClick={() => setShowCanva(true)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    padding: '10px 10px', borderRadius: 9, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                    border: '1px solid rgba(0,196,204,0.3)', background: 'rgba(0,196,204,0.07)',
                    color: '#00C4CC', transition: 'all 0.15s',
                  }}>
                  <Images size={12} />
                  Canva Designs
                </button>
                <button type="button"
                  onClick={() => setShowPDF(v => !v)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    padding: '10px 10px', borderRadius: 9, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                    border: `1px solid ${showPDF ? 'var(--sv-accent)' : 'rgba(96,165,250,0.3)'}`,
                    background: showPDF ? 'var(--sv-accent-glow)' : 'rgba(96,165,250,0.07)',
                    color: showPDF ? 'var(--sv-accent)' : '#60A5FA', transition: 'all 0.15s',
                  }}>
                  <FileUp size={12} />
                  Upload File
                </button>
              </div>

              {/* PDF uploader panel — inline, no modal */}
              {showPDF && (
                <div style={{ marginTop: 10 }}>
                  <PDFUploader
                    onComplete={handlePDFComplete}
                    onEditInAdobe={handlePDFEditInAdobe}
                  />
                </div>
              )}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, margin: '12px 0',
              }}>
                <div style={{ flex: 1, height: 1, background: 'var(--sv-border)' }} />
                <span style={{ fontSize: 10, color: 'var(--sv-muted)', fontWeight: 600, letterSpacing: '0.06em' }}>OR PASTE URL</span>
                <div style={{ flex: 1, height: 1, background: 'var(--sv-border)' }} />
              </div>
            </div>

            {/* ── Design source tabs + URL ── */}
            <div style={{ marginBottom: 16 }}>
              <label className="field-label">Design Source</label>
              <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                {(Object.keys(SOURCE_LABELS) as DesignSource[]).map(src => (
                  <button key={src} type="button"
                    onClick={() => setForm(f => ({ ...f, source: src }))}
                    style={{
                      flex: 1, padding: '7px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                      border: `1px solid ${form.source === src ? 'var(--sv-accent)' : 'var(--sv-border)'}`,
                      background: form.source === src ? 'var(--sv-accent-glow)' : 'var(--sv-surface-2)',
                      color: form.source === src ? 'var(--sv-accent)' : 'var(--sv-muted)',
                      transition: 'all 0.15s',
                    }}>
                    {SOURCE_LABELS[src].icon} {SOURCE_LABELS[src].label}
                  </button>
                ))}
              </div>
              <input
                className="field-input"
                type="text"
                value={rawInput}
                onChange={e => handleDesignInput(e.target.value)}
                placeholder={SOURCE_LABELS[form.source].placeholder}
              />
              {form.design_id && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, fontSize: 11, color: 'var(--sv-accent)' }}>
                  <span style={{
                    background: 'var(--sv-accent-glow)', border: '1px solid var(--sv-accent-border)',
                    borderRadius: 4, padding: '2px 6px', fontFamily: 'monospace',
                  }}>
                    {form.design_id.length > 32 ? form.design_id.slice(0, 32) + '…' : form.design_id}
                  </span>
                  {currentEditUrl && (
                    <a href={currentEditUrl} target="_blank" rel="noopener noreferrer"
                      style={{ color: 'var(--sv-accent)', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <ExternalLink size={11} />
                      Edit in {SOURCE_LABELS[form.source].label}
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* ── Name ── */}
            <div style={{ marginBottom: 16 }}>
              <label className="field-label">Name</label>
              <input className="field-input" type="text" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Main Menu, Summer Ad, Christmas Promo"
                required />
            </div>

            {/* ── Slot ── */}
            <div style={{ marginBottom: 16 }}>
              <label className="field-label">
                Slot
                <span style={{ fontWeight: 400, textTransform: 'none', opacity: 0.7, marginLeft: 4 }}>— used in iframe URL</span>
              </label>
              <input className="field-input" type="text" value={form.slot}
                onChange={e => { setSlotManual(true); setForm(f => ({ ...f, slot: e.target.value })) }}
                placeholder="default"
                pattern="[a-z0-9-]+" />
              <p className="field-hint">
                Embed URL: <code style={{ color: 'var(--sv-accent)', fontSize: 10 }}>
                  /embed/{userId.slice(0, 8)}…/{form.slot || 'default'}
                </code>
              </p>
            </div>

            {/* ── Holiday toggle ── */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={showDates}
                  onChange={e => setShowDates(e.target.checked)}
                  style={{ accentColor: 'var(--sv-accent)' }} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>Holiday override — active only between dates</span>
              </label>
            </div>

            {showDates && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <label className="field-label">Start Date</label>
                  <input className="field-input" type="date" value={form.start_date}
                    onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} />
                </div>
                <div>
                  <label className="field-label">End Date</label>
                  <input className="field-input" type="date" value={form.end_date}
                    onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} />
                </div>
              </div>
            )}

            {/* ── Page URL ── */}
            <div style={{ marginBottom: 16 }}>
              <label className="field-label">
                Page URL <span style={{ fontWeight: 400, textTransform: 'none', opacity: 0.7 }}>— for QR code</span>
              </label>
              <input className="field-input" type="url" value={form.page_url}
                onChange={e => setForm(f => ({ ...f, page_url: e.target.value }))}
                placeholder="https://yourrestaurant.com/menu" />
            </div>

            {/* ── Active ── */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.is_active}
                  onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                  style={{ accentColor: 'var(--sv-accent)' }} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>Active</span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" className="btn btn-primary" disabled={pending} style={{ flex: 1 }}>
                {pending ? 'Saving…' : promo ? 'Update Client' : 'Add Client'}
              </button>
              <a href="/dashboard/menus" className="btn btn-ghost">Cancel</a>
            </div>

            {/* ── Embed snippet ── */}
            {form.slot && (
              <div style={{
                marginTop: 20, padding: '14px 16px',
                background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)', borderRadius: 8,
              }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: 8, fontSize: 11, fontWeight: 800,
                  letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--sv-muted)',
                }}>
                  Embed Snippet
                  <CopyButton text={iframeSnippet} label="Copy" />
                </div>
                <code style={{ display: 'block', fontSize: 10, color: 'var(--sv-accent)', wordBreak: 'break-all', lineHeight: 1.6 }}>
                  {iframeSnippet}
                </code>
              </div>
            )}
          </div>
        </form>

        {/* ── Live Preview ── */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--sv-muted)' }}>
              Live Preview
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              {currentEmbedUrl && (
                <a href={currentEmbedUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                  <ExternalLink size={11} /> Open
                </a>
              )}
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPreviewKey(k => k + 1)}>
                <Eye size={11} /> Refresh
              </button>
            </div>
          </div>

          <div className="card" style={{ overflow: 'hidden', minHeight: 480, background: currentEmbedUrl ? 'transparent' : 'var(--sv-surface)' }}>
            {currentEmbedUrl ? (
              <iframe key={previewKey} src={currentEmbedUrl}
                style={{ width: '100%', height: 600, border: 'none', display: 'block' }}
                allowFullScreen title="Design Preview" />
            ) : (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', height: 480, color: 'var(--sv-muted)', gap: 16,
              }}>
                <div style={{ fontSize: 40 }}>🎨</div>
                <p style={{ fontSize: 13, margin: 0, textAlign: 'center', maxWidth: 280 }}>
                  Use the Design Studio above or paste a URL to preview your design
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button type="button" onClick={() => setShowAdobe(true)}
                    className="btn btn-ghost btn-sm" style={{ fontSize: 11 }}>
                    ✦ Adobe Express
                  </button>
                  <button type="button" onClick={() => setShowCanva(true)}
                    className="btn btn-ghost btn-sm" style={{ fontSize: 11 }}>
                    🎨 Canva
                  </button>
                  <button type="button" onClick={() => setShowPDF(true)}
                    className="btn btn-ghost btn-sm" style={{ fontSize: 11 }}>
                    📄 Upload File
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(8px) }
          to   { opacity: 1; transform: translateY(0) }
        }
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>
    </>
  )
}
