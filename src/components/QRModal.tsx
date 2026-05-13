'use client'

import { useState } from 'react'
import { X, Download, QrCode, ExternalLink } from 'lucide-react'

interface Props {
  slot: string
  name: string
  pageUrl: string
  embedUrl: string
  onClose: () => void
}

export default function QRModal({ slot, name, pageUrl, embedUrl, onClose }: Props) {
  const [size, setSize]   = useState<300 | 600>(300)
  const [copied, setCopied] = useState(false)

  // Prefer the restaurant's own page URL — that's what guests should scan
  const qrTarget = pageUrl || embedUrl
  const qrSrc    = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=16&data=${encodeURIComponent(qrTarget)}`
  const dlSrc    = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&margin=24&data=${encodeURIComponent(qrTarget)}`

  async function handleDownload() {
    const res  = await fetch(dlSrc)
    const blob = await res.blob()
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `servvee-qr-${slot}.png`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function copyUrl() {
    await navigator.clipboard.writeText(qrTarget)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(13,13,18,0.88)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div style={{
        background: 'var(--sv-surface)', borderRadius: 16,
        border: '1px solid var(--sv-border)',
        width: '100%', maxWidth: 420, overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: '1px solid var(--sv-border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <QrCode size={16} style={{ color: 'var(--sv-accent)' }} />
            <span style={{ fontSize: 14, fontWeight: 800 }}>QR Code — {name}</span>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--sv-muted)', display: 'flex', padding: 4,
          }}>
            <X size={18} />
          </button>
        </div>

        {/* QR code */}
        <div style={{ padding: '28px 0', textAlign: 'center', background: 'var(--sv-surface-2)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrSrc}
            alt={`QR code for ${name}`}
            width={size}
            height={size}
            style={{
              borderRadius: 12, background: '#fff', padding: 12,
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)', display: 'inline-block',
            }}
          />
        </div>

        {/* URL it points to */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--sv-border)' }}>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--sv-muted)', marginBottom: 6 }}>
            Points to
          </p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <code style={{
              flex: 1, fontSize: 11, color: 'var(--sv-accent)',
              background: 'var(--sv-accent-glow)', border: '1px solid var(--sv-accent-border)',
              borderRadius: 6, padding: '6px 10px',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block',
            }}>
              {qrTarget}
            </code>
            <button onClick={copyUrl} style={{
              fontSize: 11, fontWeight: 700, padding: '6px 12px', borderRadius: 6,
              border: '1px solid var(--sv-border)', background: 'none',
              color: copied ? 'var(--sv-success)' : 'var(--sv-muted)', cursor: 'pointer', flexShrink: 0,
            }}>
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          {!pageUrl && (
            <p style={{ fontSize: 10, color: 'var(--sv-warning)', marginTop: 6 }}>
              Add a <strong>Page URL</strong> in the menu settings to point guests to your website instead.
            </p>
          )}
        </div>

        {/* Size toggle + actions */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--sv-border)', display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 4, flex: 1 }}>
            {([300, 600] as const).map(s => (
              <button key={s} onClick={() => setSize(s)} style={{
                fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 6, cursor: 'pointer',
                border: `1px solid ${size === s ? 'var(--sv-accent)' : 'var(--sv-border)'}`,
                background: size === s ? 'var(--sv-accent-glow)' : 'none',
                color: size === s ? 'var(--sv-accent)' : 'var(--sv-muted)',
              }}>
                {s}px
              </button>
            ))}
          </div>
          <a href={qrTarget} target="_blank" rel="noopener noreferrer"
            className="btn btn-ghost btn-sm" style={{ gap: 5 }}>
            <ExternalLink size={11} /> Test
          </a>
          <button onClick={handleDownload} className="btn btn-primary btn-sm" style={{ gap: 5 }}>
            <Download size={11} /> Download PNG
          </button>
        </div>
      </div>
    </div>
  )
}
