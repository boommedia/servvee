'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Loader2, RefreshCw, ExternalLink } from 'lucide-react'

interface CanvaDesign {
  id: string
  title: string
  thumbnail: string | null
  updated_at: string
}

interface Props {
  onSelect: (designId: string, title: string) => void
  onClose: () => void
}

export default function CanvaDesignPicker({ onSelect, onClose }: Props) {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected' | 'error'>('checking')
  const [designs, setDesigns] = useState<CanvaDesign[]>([])
  const [loading, setLoading] = useState(false)

  const fetchDesigns = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/canva/designs')
      if (res.status === 401) { setStatus('disconnected'); return }
      if (!res.ok) throw new Error()
      const data = await res.json() as { designs: CanvaDesign[] }
      setDesigns(data.designs ?? [])
      setStatus('connected')
    } catch {
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchDesigns() }, [fetchDesigns])

  async function handleDisconnect() {
    await fetch('/api/canva/disconnect', { method: 'POST' })
    setDesigns([])
    setStatus('disconnected')
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(13,13,18,0.92)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div style={{
        background: 'var(--sv-surface)', borderRadius: 14,
        border: '1px solid var(--sv-border)',
        width: '100%', maxWidth: 780, maxHeight: '88vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: '1px solid var(--sv-border)', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>🎨</span>
            <span style={{ fontSize: 14, fontWeight: 800 }}>Your Canva Designs</span>
            {status === 'connected' && (
              <span style={{
                fontSize: 9, fontWeight: 800, letterSpacing: '0.08em',
                background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.25)',
                color: 'var(--sv-success)', borderRadius: 20, padding: '2px 8px', textTransform: 'uppercase',
              }}>Connected</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {status === 'connected' && (
              <>
                <button onClick={fetchDesigns} title="Refresh" style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--sv-muted)', display: 'flex', padding: 6, borderRadius: 6,
                }}>
                  <RefreshCw size={14} />
                </button>
                <button onClick={handleDisconnect} style={{
                  fontSize: 11, padding: '4px 10px', borderRadius: 6,
                  border: '1px solid var(--sv-border)', background: 'none',
                  color: 'var(--sv-muted)', cursor: 'pointer', fontWeight: 600,
                }}>
                  Disconnect
                </button>
              </>
            )}
            <button onClick={onClose} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--sv-muted)', display: 'flex', padding: 4,
            }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>

          {status === 'checking' && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--sv-muted)' }}>
              <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
              <p style={{ fontSize: 13, marginTop: 12 }}>Checking connection…</p>
            </div>
          )}

          {(status === 'disconnected' || status === 'error') && (
            <div style={{ textAlign: 'center', padding: '60px 0', maxWidth: 380, margin: '0 auto' }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>🎨</div>
              <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>Connect your Canva account</h3>
              <p style={{ fontSize: 13, color: 'var(--sv-muted)', marginBottom: 28, lineHeight: 1.6 }}>
                Connect once and browse all your Canva designs right here — no more copying URLs.
              </p>
              <a href="/api/canva/auth" className="btn btn-primary" style={{ display: 'inline-flex', justifyContent: 'center' }}>
                🎨 Connect Canva
              </a>
            </div>
          )}

          {status === 'connected' && loading && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--sv-muted)' }}>
              <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
              <p style={{ fontSize: 12, marginTop: 10 }}>Loading your designs…</p>
            </div>
          )}

          {status === 'connected' && !loading && designs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--sv-muted)' }}>
              <p style={{ fontSize: 13, marginBottom: 12 }}>No designs found in your Canva account.</p>
              <a href="https://www.canva.com/create/" target="_blank" rel="noopener noreferrer"
                className="btn btn-ghost btn-sm" style={{ display: 'inline-flex', gap: 6, justifyContent: 'center' }}>
                <ExternalLink size={11} /> Create in Canva
              </a>
            </div>
          )}

          {status === 'connected' && !loading && designs.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 12 }}>
              {designs.map(d => (
                <button key={d.id}
                  onClick={() => onSelect(d.id, d.title)}
                  style={{
                    background: 'var(--sv-surface-2)', border: '2px solid var(--sv-border)',
                    borderRadius: 10, overflow: 'hidden', cursor: 'pointer',
                    textAlign: 'left', padding: 0, transition: 'border-color 0.15s',
                    display: 'flex', flexDirection: 'column',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--sv-accent)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--sv-border)' }}
                >
                  {d.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={d.thumbnail} alt={d.title}
                      style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block' }} />
                  ) : (
                    <div style={{
                      width: '100%', height: 110, background: 'var(--sv-accent-glow)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30,
                    }}>🎨</div>
                  )}
                  <div style={{ padding: '8px 10px', flex: 1 }}>
                    <p style={{
                      fontSize: 11, fontWeight: 700, margin: 0,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      color: 'var(--sv-text)',
                    }}>
                      {d.title || 'Untitled'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div style={{
          padding: '10px 20px', borderTop: '1px solid var(--sv-border)',
          fontSize: 11, color: 'var(--sv-muted)', flexShrink: 0,
        }}>
          Ensure your Canva design is set to <strong style={{ color: 'var(--sv-text)' }}>Anyone with the link can view</strong> so the public embed works.
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
