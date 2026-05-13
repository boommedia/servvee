'use client'

import { useEffect, useState } from 'react'
import { X, Loader2 } from 'lucide-react'

declare global {
  interface Window {
    CCEverywhere: {
      initialize(config: {
        clientId: string
        appName: string
        appVersion?: { major: number; minor: number }
        platformCategory?: string
      }): Promise<{
        editor: {
          create(params: AdobeEditorParams): void
          edit(params: AdobeEditorParams): void
        }
      }>
    }
  }
}

interface AdobeEditorParams {
  callbacks: {
    onPublish?: (intent: string, publishParams: {
      asset?: { publishUrl?: string; data?: string }
      exportedAssets?: Array<{ data: string; type: string }>
    }) => void
    onCancel?: () => void
    onError?: (err: unknown) => void
  }
  outputParams?: { outputType: 'url' | 'base64' }
  inputParams?: {
    canvasSize?: { width: number; height: number }
    templateType?: string
  }
}

interface Props {
  onComplete: (url: string) => void
  onClose: () => void
}

export default function AdobeExpressEditor({ onComplete, onClose }: Props) {
  const clientId = process.env.NEXT_PUBLIC_ADOBE_CLIENT_ID
  const [status, setStatus] = useState<'loading' | 'opened' | 'error'>('loading')
  const [errMsg, setErrMsg] = useState('')

  useEffect(() => {
    if (!clientId) {
      setErrMsg('NEXT_PUBLIC_ADOBE_CLIENT_ID is not set.')
      setStatus('error')
      return
    }

    let script: HTMLScriptElement | null = null

    async function init() {
      script = document.createElement('script')
      script.src = 'https://sdk.cc.adobe.io/v1/sdk.js'
      script.async = true
      await new Promise<void>((resolve, reject) => {
        script!.onload = () => resolve()
        script!.onerror = () => reject(new Error('Script load failed'))
        document.head.appendChild(script!)
      })

      const cc = await window.CCEverywhere.initialize({
        clientId: clientId!,
        appName: 'Servvee',
        appVersion: { major: 1, minor: 0 },
        platformCategory: 'web',
      })

      // Adobe manages its own overlay from here — our loading screen can disappear
      setStatus('opened')

      cc.editor.create({
        callbacks: {
          onPublish: (_intent, publishParams) => {
            const url = publishParams?.asset?.publishUrl ?? ''
            if (url) onComplete(url)
            else onClose()
          },
          onCancel: onClose,
          onError: (err) => {
            console.error('Adobe Express error:', err)
            setErrMsg('Adobe Express encountered an error.')
            setStatus('error')
          },
        },
        outputParams: { outputType: 'url' },
        inputParams: {
          canvasSize: { width: 1080, height: 1350 }, // portrait menu
          templateType: 'flyer',
        },
      })
    }

    init().catch((err: unknown) => {
      setErrMsg(err instanceof Error ? err.message : 'Failed to load Adobe Express.')
      setStatus('error')
    })

    return () => {
      if (script && document.head.contains(script)) document.head.removeChild(script)
    }
  }, [clientId, onComplete, onClose])

  // Adobe manages its own overlay once opened — nothing to render
  if (status === 'opened') return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(13,13,18,0.92)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: 'var(--sv-surface)', borderRadius: 14,
        border: '1px solid var(--sv-border)',
        padding: '40px 48px', textAlign: 'center', maxWidth: 380, position: 'relative',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 12, right: 12,
          background: 'none', border: 'none', cursor: 'pointer', color: 'var(--sv-muted)', padding: 6,
        }}>
          <X size={18} />
        </button>

        {status === 'loading' && (
          <>
            <div style={{ fontSize: 36, marginBottom: 16, color: '#FF0000' }}>✦</div>
            <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>Opening Adobe Express…</p>
            <p style={{ fontSize: 12, color: 'var(--sv-muted)', marginBottom: 20 }}>
              The design editor will appear in a moment
            </p>
            <Loader2 size={22} style={{ animation: 'spin 1s linear infinite', color: 'var(--sv-accent)' }} />
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ fontSize: 36, marginBottom: 16 }}>⚠️</div>
            <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: 'var(--sv-danger)' }}>
              Adobe Express unavailable
            </p>
            <p style={{ fontSize: 12, color: 'var(--sv-muted)', marginBottom: 20 }}>{errMsg}</p>
            <button onClick={onClose} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
              Close
            </button>
          </>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
