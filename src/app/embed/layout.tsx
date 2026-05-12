// Minimal layout for embed pages — no nav, no padding, no frame chrome
export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`* { margin: 0; padding: 0; box-sizing: border-box; } body { background: #000; }`}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
