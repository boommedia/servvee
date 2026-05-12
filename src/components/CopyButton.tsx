'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

interface Props {
  text: string
  label?: string
}

export default function CopyButton({ text, label = 'Copy' }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.cssText = 'position:fixed;opacity:0;'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <button onClick={handleCopy} style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '4px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer',
      background: copied ? 'rgba(74,222,128,0.12)' : 'var(--sv-accent-glow)',
      border: `1px solid ${copied ? 'rgba(74,222,128,0.3)' : 'var(--sv-accent-border)'}`,
      color: copied ? 'var(--sv-success)' : 'var(--sv-accent)',
      borderRadius: 7, transition: 'all 0.15s', whiteSpace: 'nowrap',
    }}>
      {copied ? <Check size={10} /> : <Copy size={10} />}
      {copied ? 'Copied!' : label}
    </button>
  )
}
