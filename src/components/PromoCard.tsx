'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTransition, useState } from 'react'
import { ExternalLink, Pencil, Trash2, QrCode } from 'lucide-react'
import { promoStatus, embedUrl, editUrl } from '@/lib/types'
import type { Promo, PromoStatus } from '@/lib/types'
import CopyButton from './CopyButton'
import dynamic from 'next/dynamic'

const QRModal = dynamic(() => import('./QRModal'), { ssr: false })

const STATUS_STYLES: Record<PromoStatus, { label: string; bg: string; color: string; border: string }> = {
  live:      { label: 'LIVE',      bg: 'rgba(74,222,128,0.12)',  color: '#4ADE80', border: 'rgba(74,222,128,0.3)' },
  default:   { label: 'DEFAULT',   bg: 'var(--sv-accent-glow)', color: 'var(--sv-accent)', border: 'var(--sv-accent-border)' },
  scheduled: { label: 'SCHEDULED', bg: 'rgba(251,191,36,0.10)', color: '#FBBF24', border: 'rgba(251,191,36,0.3)' },
  inactive:  { label: 'OFF',       bg: 'rgba(136,136,153,0.08)', color: 'var(--sv-muted)', border: 'var(--sv-border)' },
}

const SOURCE_ICONS: Record<string, string> = { canva: '🎨', adobe: '✦', url: '🔗' }

interface Props { promo: Promo; userId: string }

export default function PromoCard({ promo, userId }: Props) {
  const router    = useRouter()
  const [pending, start] = useTransition()
  const [showQR, setShowQR] = useState(false)
  const status    = promoStatus(promo)
  const ss        = STATUS_STYLES[status]
  const embed     = embedUrl(promo)
  const edit      = editUrl(promo)

  const appUrl    = process.env.NEXT_PUBLIC_APP_URL ?? 'https://servvee.online'
  const iframeSnippet = `<iframe src="${appUrl}/embed/${userId}/${promo.slot}" style="width:100%;height:600px;border:none;" allowfullscreen loading="lazy"></iframe>`

  const qrUrl = promo.page_url
    ? `https://api.qrserver.com/v1/create-qr-code/?size=72x72&data=${encodeURIComponent(promo.page_url)}`
    : null

  async function handleDelete() {
    if (!confirm(`Delete "${promo.name}"?`)) return
    start(async () => {
      await fetch(`/api/promos/${promo.id}`, { method: 'DELETE' })
      router.refresh()
    })
  }

  return (
    <>
    {showQR && (
      <QRModal
        slot={promo.slot}
        name={promo.name}
        pageUrl={promo.page_url}
        embedUrl={`${process.env.NEXT_PUBLIC_APP_URL ?? 'https://servvee.online'}/embed/${userId}/${promo.slot}`}
        onClose={() => setShowQR(false)}
      />
    )}
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 14,
      background: 'var(--sv-surface-2)',
      border: '1px solid var(--sv-border)',
      borderRadius: 'var(--sv-radius-sm)',
      padding: '14px 16px',
      transition: 'border-color 0.15s',
      opacity: pending ? 0.5 : 1,
    }}>
      {/* Status badge */}
      <div style={{
        flexShrink: 0, fontSize: 9, fontWeight: 800, letterSpacing: '0.12em',
        padding: '4px 9px', borderRadius: 20, marginTop: 2, whiteSpace: 'nowrap',
        background: ss.bg, color: ss.color, border: `1px solid ${ss.border}`,
      }}>
        {ss.label}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>{promo.name}</span>
          <span style={{ fontSize: 12 }}>{SOURCE_ICONS[promo.source] ?? '🔗'}</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--sv-muted)', marginBottom: 6 }}>
          slot: <code style={{
            color: 'var(--sv-accent)', background: 'var(--sv-accent-glow)',
            padding: '1px 5px', borderRadius: 4,
          }}>{promo.slot}</code>
          {promo.start_date && (
            <> &bull; {promo.start_date} → {promo.end_date}</>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <code style={{
            fontSize: 10, color: 'var(--sv-accent)',
            background: 'var(--sv-accent-glow)',
            border: '1px solid var(--sv-accent-border)',
            padding: '2px 7px', borderRadius: 5,
          }}>
            {iframeSnippet.slice(0, 80)}…
          </code>
          <CopyButton text={iframeSnippet} label="Copy embed" />
        </div>
      </div>

      {/* QR thumbnail — click to open modal */}
      {qrUrl && (
        <button onClick={() => setShowQR(true)} title="View & download QR code" style={{
          flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        }}>
          <img src={qrUrl} alt="QR" width={72} height={72}
            style={{ borderRadius: 6, background: '#fff', padding: 3, display: 'block' }} />
        </button>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flexShrink: 0 }}>
        <a href={embed} target="_blank" rel="noopener noreferrer"
          className="btn btn-ghost btn-sm" style={{ gap: 4 }}>
          <ExternalLink size={11} /> Preview
        </a>
        <a href={edit} target="_blank" rel="noopener noreferrer"
          className="btn btn-ghost btn-sm" style={{ gap: 4 }}>
          <ExternalLink size={11} /> Edit design
        </a>
        <Link href={`/dashboard/menus/${promo.id}`} className="btn btn-ghost btn-sm" style={{ gap: 4 }}>
          <Pencil size={11} /> Edit
        </Link>
        <button onClick={() => setShowQR(true)} className="btn btn-ghost btn-sm" style={{ gap: 4 }}>
          <QrCode size={11} /> QR Code
        </button>
        <button onClick={handleDelete} className="btn btn-danger btn-sm" style={{ gap: 4 }}>
          <Trash2 size={11} /> Delete
        </button>
      </div>
    </div>
    </>
  )
}
