'use client'

import { useState, useRef } from 'react'
import { Upload, FileText, Image, X, Wand2, CheckCircle } from 'lucide-react'

interface Props {
  onComplete: (url: string, suggestedName: string) => void
  onEditInAdobe: (fileUrl: string) => void
}

const ACCEPTED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]

const ACCEPTED_EXT = '.pdf,.jpg,.jpeg,.png,.webp,.gif'

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function isImage(type: string) {
  return type.startsWith('image/')
}

export default function PDFUploader({ onComplete, onEditInAdobe }: Props) {
  const [status, setStatus]         = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const [filename, setFilename]     = useState('')
  const [filesize, setFilesize]     = useState(0)
  const [filetype, setFiletype]     = useState('')
  const [uploadedUrl, setUploadedUrl] = useState('')
  const [errMsg, setErrMsg]         = useState('')
  const [dragging, setDragging]     = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function processFile(file: File) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setErrMsg('Supported formats: PDF, JPEG, PNG, WebP, GIF.')
      setStatus('error')
      return
    }
    if (file.size > 20 * 1024 * 1024) {
      setErrMsg('File must be under 20 MB.')
      setStatus('error')
      return
    }

    setStatus('uploading')
    setFilename(file.name)
    setFilesize(file.size)
    setFiletype(file.type)
    setErrMsg('')

    const body = new FormData()
    body.append('file', file)

    try {
      const res  = await fetch('/api/upload/pdf', { method: 'POST', body })
      const data = await res.json() as { url?: string; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Upload failed')
      setUploadedUrl(data.url!)
      setStatus('done')
      const baseName = file.name.replace(/\.[^.]+$/, '')
      onComplete(data.url!, baseName)
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : 'Upload failed')
      setStatus('error')
    }
  }

  function reset() {
    setStatus('idle')
    setFilename('')
    setFilesize(0)
    setFiletype('')
    setUploadedUrl('')
    setErrMsg('')
  }

  if (status === 'done') {
    return (
      <div style={{
        border: '1px solid rgba(74,222,128,0.3)', borderRadius: 10,
        background: 'rgba(74,222,128,0.05)', padding: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <CheckCircle size={18} style={{ color: 'var(--sv-success)', flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {filename}
            </div>
            <div style={{ fontSize: 11, color: 'var(--sv-muted)' }}>{formatBytes(filesize)} · Uploaded</div>
          </div>
          <button onClick={reset} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--sv-muted)', padding: 4, flexShrink: 0,
          }}>
            <X size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <button
            type="button"
            onClick={() => onEditInAdobe(uploadedUrl)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '8px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer',
              border: '1px solid rgba(255,107,107,0.3)', background: 'rgba(255,107,107,0.07)',
              color: '#FF6B6B',
            }}>
            <Wand2 size={12} /> Edit in Adobe Express
          </button>
          <a
            href={uploadedUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '8px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700,
              border: '1px solid var(--sv-border)', background: 'var(--sv-surface-2)',
              color: 'var(--sv-muted)', textDecoration: 'none',
            }}>
            {isImage(filetype) ? <Image size={12} /> : <FileText size={12} />}
            View File
          </a>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => {
          e.preventDefault()
          setDragging(false)
          const f = e.dataTransfer.files[0]
          if (f) processFile(f)
        }}
        style={{
          border: `2px dashed ${dragging ? 'var(--sv-accent)' : errMsg ? 'var(--sv-danger)' : 'var(--sv-border)'}`,
          borderRadius: 10, padding: '28px 20px', textAlign: 'center', cursor: 'pointer',
          background: dragging ? 'var(--sv-accent-glow)' : 'var(--sv-surface-2)',
          transition: 'all 0.15s',
        }}>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXT}
          style={{ display: 'none' }}
          onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f) }}
        />

        {status === 'uploading' ? (
          <>
            <div style={{ fontSize: 28, marginBottom: 10 }}>📤</div>
            <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Uploading {filename}…</p>
            <div style={{ height: 3, background: 'var(--sv-border)', borderRadius: 2, margin: '12px 0', overflow: 'hidden' }}>
              <div style={{
                height: '100%', background: 'var(--sv-accent)', borderRadius: 2,
                width: '60%', animation: 'fileProgress 1.2s ease-in-out infinite alternate',
              }} />
            </div>
            <p style={{ fontSize: 11, color: 'var(--sv-muted)' }}>This may take a moment…</p>
          </>
        ) : (
          <>
            <Upload size={28} style={{ color: 'var(--sv-muted)', marginBottom: 10 }} />
            <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
              Drop your file here
            </p>
            <p style={{ fontSize: 11, color: 'var(--sv-muted)', marginBottom: 0 }}>
              or click to browse · Max 20 MB
            </p>
          </>
        )}
      </div>

      {errMsg && (
        <p style={{ fontSize: 11, color: 'var(--sv-danger)', marginTop: 6 }}>{errMsg}</p>
      )}

      <p style={{ fontSize: 10, color: 'var(--sv-muted)', marginTop: 8, lineHeight: 1.5 }}>
        Supported: <strong style={{ color: 'var(--sv-text)' }}>PDF, JPEG, PNG, WebP, GIF</strong> — exported from Canva, Adobe, Word, InDesign, or any design tool.
        After upload, use <strong style={{ color: 'var(--sv-text)' }}>Edit in Adobe Express</strong> to redesign it.
      </p>

      <style>{`
        @keyframes fileProgress {
          from { transform: translateX(-100%) }
          to   { transform: translateX(200%) }
        }
      `}</style>
    </div>
  )
}
