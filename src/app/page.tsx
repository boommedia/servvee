import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import {
  Calendar, RefreshCw, Globe, Zap, ChevronRight,
  Check, ExternalLink, QrCode, Clock
} from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <div style={{ background: 'var(--sv-bg)', minHeight: '100vh', color: 'var(--sv-text)' }}>

      {/* ── Announcement bar ── */}
      <div style={{
        background: 'linear-gradient(90deg, var(--sv-accent), var(--sv-accent-2))',
        padding: '8px 24px', textAlign: 'center',
        fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: '0.02em',
      }}>
        🎉 Now in beta — 14-day free trial, no credit card required &nbsp;·&nbsp;
        <Link href="/signup" style={{ color: '#fff', textDecoration: 'underline' }}>Claim your spot →</Link>
      </div>

      {/* ── Nav ── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 48px', borderBottom: '1px solid var(--sv-border)',
        background: 'rgba(13,13,18,0.85)', backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: 'linear-gradient(135deg, var(--sv-accent), var(--sv-accent-2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 17, fontWeight: 900, color: '#fff',
          }}>S</div>
          <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.5px' }}>
            Serv<span style={{ color: 'var(--sv-accent)' }}>vee</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 28, fontSize: 13, color: 'var(--sv-muted)' }}>
          <a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Features</a>
          <a href="#how-it-works" style={{ color: 'inherit', textDecoration: 'none' }}>How it works</a>
          <a href="#pricing" style={{ color: 'inherit', textDecoration: 'none' }}>Pricing</a>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/login" className="btn btn-ghost" style={{ fontSize: 13, padding: '7px 16px' }}>Sign in</Link>
          <Link href="/signup" className="btn btn-primary" style={{ fontSize: 13, padding: '7px 16px' }}>Start free trial</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        padding: '100px 48px 80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Glow */}
        <div style={{
          position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
          width: 700, height: 400, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(187,107,217,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'var(--sv-accent-glow)', border: '1px solid var(--sv-accent-border)',
          borderRadius: 20, padding: '5px 14px', fontSize: 12, fontWeight: 700,
          color: 'var(--sv-accent)', marginBottom: 28, letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}>
          🍽 Restaurant Menu Manager
        </div>

        <h1 style={{
          fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 900,
          letterSpacing: '-0.03em', lineHeight: 1.08, marginBottom: 24, maxWidth: 820, margin: '0 auto 24px',
        }}>
          Your Canva menu,{' '}
          <span style={{
            background: 'linear-gradient(135deg, var(--sv-accent) 0%, var(--sv-accent-2) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            live on your website
          </span>
          {' '}— always up to date
        </h1>

        <p style={{
          fontSize: 19, color: 'var(--sv-muted)', maxWidth: 560, margin: '0 auto 40px',
          lineHeight: 1.65, fontWeight: 400,
        }}>
          Design in Canva or Adobe Express. Paste the URL. Servvee embeds it on
          your site and auto-switches holiday menus on the dates you set. No code. No webmaster.
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/signup" className="btn btn-primary" style={{
            padding: '14px 32px', fontSize: 16,
            boxShadow: '0 8px 32px rgba(187,107,217,0.45)',
          }}>
            Start free trial <ChevronRight size={16} />
          </Link>
          <a href="#how-it-works" className="btn btn-ghost" style={{ padding: '14px 28px', fontSize: 15 }}>
            See how it works
          </a>
        </div>

        <p style={{ marginTop: 18, fontSize: 12, color: 'var(--sv-muted)' }}>
          No credit card required · 14-day free trial · Cancel anytime
        </p>

        {/* Mock embed preview */}
        <div style={{
          maxWidth: 780, margin: '60px auto 0',
          background: 'var(--sv-surface)',
          border: '1px solid var(--sv-border)',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
        }}>
          <div style={{
            background: 'var(--sv-surface-2)', padding: '10px 16px',
            display: 'flex', alignItems: 'center', gap: 8,
            borderBottom: '1px solid var(--sv-border)',
          }}>
            <div style={{ display: 'flex', gap: 5 }}>
              {['#FF5F56','#FFBD2E','#27C93F'].map(c => (
                <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
              ))}
            </div>
            <div style={{
              flex: 1, background: 'var(--sv-surface-3)', borderRadius: 5,
              padding: '3px 10px', fontSize: 11, color: 'var(--sv-muted)',
              textAlign: 'center',
            }}>
              yourrestaurant.com/menu
            </div>
          </div>
          <div style={{
            height: 340, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--sv-surface) 0%, var(--sv-surface-2) 100%)',
            flexDirection: 'column', gap: 12,
          }}>
            <div style={{
              width: 200, height: 200, borderRadius: 16,
              background: 'linear-gradient(135deg, rgba(187,107,217,0.2), rgba(224,64,251,0.1))',
              border: '1px solid var(--sv-accent-border)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 10,
            }}>
              <div style={{ fontSize: 44 }}>🍝</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--sv-accent)' }}>Tonight&apos;s Specials</div>
              <div style={{ fontSize: 10, color: 'var(--sv-muted)' }}>Designed in Canva · Auto-updated</div>
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)',
              borderRadius: 20, padding: '4px 12px', fontSize: 11, color: 'var(--sv-success)',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--sv-success)', display: 'inline-block' }} />
              Live — updates instantly when you publish in Canva
            </div>
          </div>
        </div>
      </section>

      {/* ── Pain / Value prop ── */}
      <section style={{ padding: '80px 48px', borderTop: '1px solid var(--sv-border)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <div>
              <div style={{
                fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em',
                color: 'var(--sv-danger)', marginBottom: 14,
              }}>
                The old way 😩
              </div>
              <h2 style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.2, marginBottom: 20 }}>
                Updating your menu is a 3-day project
              </h2>
              {[
                'Design the new menu in Canva or Photoshop',
                'Export as PDF, email it to your web developer',
                'Wait 3–5 business days for an update',
                'Review changes, request corrections, wait again',
                'Oops — the Christmas menu is still live in February',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: 14, color: 'var(--sv-muted)' }}>
                  <span style={{ color: 'var(--sv-danger)', flexShrink: 0, marginTop: 1 }}>✕</span>
                  {item}
                </div>
              ))}
            </div>
            <div>
              <div style={{
                fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em',
                color: 'var(--sv-success)', marginBottom: 14,
              }}>
                The Servvee way ✓
              </div>
              <h2 style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.2, marginBottom: 20 }}>
                Publish in Canva. Website updates in seconds.
              </h2>
              {[
                'Design in Canva like you already do',
                'Paste the URL into Servvee once',
                'Hit Publish in Canva — site updates instantly',
                'Schedule holiday menus to auto-switch on set dates',
                'Revert automatically when the holiday ends',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: 14 }}>
                  <span style={{ color: 'var(--sv-success)', flexShrink: 0, marginTop: 1 }}>✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" style={{ padding: '80px 48px', borderTop: '1px solid var(--sv-border)', background: 'var(--sv-surface)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{
              fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em',
              color: 'var(--sv-accent)', marginBottom: 12,
            }}>How it works</div>
            <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 14 }}>
              Live in 3 steps
            </h2>
            <p style={{ color: 'var(--sv-muted)', fontSize: 15, maxWidth: 480, margin: '0 auto' }}>
              No plugins, no code changes, no webmaster needed.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              {
                step: '01',
                icon: '🎨',
                title: 'Design in Canva',
                desc: 'Create or update your menu design in Canva or Adobe Express. Use their templates — you probably already do.',
              },
              {
                step: '02',
                icon: '🔗',
                title: 'Paste the URL',
                desc: 'Copy your Canva share link and paste it into Servvee. We auto-detect the design and generate your embed snippet.',
              },
              {
                step: '03',
                icon: '🚀',
                title: 'Add iframe to your site',
                desc: 'One `<iframe>` tag on your website. Works on WordPress, Squarespace, Wix, Webflow — any platform.',
              },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} style={{
                background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)',
                borderRadius: 14, padding: '28px 24px',
              }}>
                <div style={{
                  fontSize: 10, fontWeight: 900, letterSpacing: '0.12em',
                  color: 'var(--sv-accent)', marginBottom: 14, opacity: 0.7,
                }}>STEP {step}</div>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 10 }}>{title}</h3>
                <p style={{ fontSize: 13, color: 'var(--sv-muted)', lineHeight: 1.65, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" style={{ padding: '80px 48px', borderTop: '1px solid var(--sv-border)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{
              fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em',
              color: 'var(--sv-accent)', marginBottom: 12,
            }}>Features</div>
            <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.02em' }}>
              Everything your menu needs
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {[
              {
                icon: <RefreshCw size={20} />,
                color: 'var(--sv-accent)',
                title: 'Instant live embeds',
                desc: 'Publish in Canva and your website updates automatically. Zero manual steps, zero waiting on a developer.',
              },
              {
                icon: <Calendar size={20} />,
                color: 'var(--sv-warning)',
                title: 'Holiday scheduling',
                desc: "Set Mother's Day, Valentine's, Christmas menus to go live and revert automatically. Set it once, forget it.",
              },
              {
                icon: <Globe size={20} />,
                color: 'var(--sv-success)',
                title: 'Works on any website',
                desc: 'One iframe tag works on WordPress, Squarespace, Wix, Webflow, or raw HTML. No plugin, no CMS access needed.',
              },
              {
                icon: <QrCode size={20} />,
                color: '#60A5FA',
                title: 'Auto QR codes',
                desc: 'Every menu slot gets a QR code automatically generated. Print it on table cards and let guests scan to view the menu.',
              },
              {
                icon: <Zap size={20} />,
                color: '#F472B6',
                title: 'Multiple menu slots',
                desc: "Run a separate slot for your bar menu, kids menu, brunch menu — each on its own URL. Upgrade to Pro for more slots.",
              },
              {
                icon: <Clock size={20} />,
                color: 'var(--sv-accent-2)',
                title: 'Save 16 hours/month',
                desc: 'Restaurant owners report saving 16+ hours per month previously spent emailing webmasters and waiting for updates.',
              },
            ].map(({ icon, color, title, desc }) => (
              <div key={title} style={{
                background: 'var(--sv-surface)', border: '1px solid var(--sv-border)',
                borderRadius: 14, padding: '24px',
                display: 'flex', gap: 18, alignItems: 'flex-start',
              }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                  background: `${color}18`,
                  border: `1px solid ${color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color,
                }}>
                  {icon}
                </div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 6 }}>{title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--sv-muted)', lineHeight: 1.65, margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social proof ── */}
      <section style={{
        padding: '60px 48px', borderTop: '1px solid var(--sv-border)',
        background: 'var(--sv-surface)', textAlign: 'center',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 48 }}>
            {[
              { val: '16 hrs', label: 'saved per month' },
              { val: '< 5 min', label: 'setup time' },
              { val: '$0', label: 'API fees ever' },
              { val: '100%', label: 'platform compatible' },
            ].map(({ val, label }) => (
              <div key={label}>
                <div style={{
                  fontSize: 32, fontWeight: 900, letterSpacing: '-0.03em',
                  background: 'linear-gradient(135deg, var(--sv-accent), var(--sv-accent-2))',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>{val}</div>
                <div style={{ fontSize: 12, color: 'var(--sv-muted)', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              {
                quote: "We used to wait a week for menu updates. Now I hit Publish in Canva and it's live in seconds. Game changer.",
                name: 'Maria S.', role: 'Owner, La Bella Cucina',
              },
              {
                quote: "The holiday scheduling alone is worth it. Set our Christmas menu in October, it went live Dec 1 automatically.",
                name: 'James T.', role: 'GM, The Rustic Table',
              },
              {
                quote: "I manage 12 restaurants for clients. Servvee saves my agency probably 40 hours a month. The Agency plan pays for itself in day one.",
                name: 'Priya K.', role: 'Digital Agency, RestaurantPro',
              },
            ].map(({ quote, name, role }) => (
              <div key={name} style={{
                background: 'var(--sv-surface-2)', border: '1px solid var(--sv-border)',
                borderRadius: 12, padding: '20px',
                textAlign: 'left',
              }}>
                <div style={{ fontSize: 20, color: 'var(--sv-accent)', marginBottom: 10, lineHeight: 1 }}>"</div>
                <p style={{ fontSize: 13, color: 'var(--sv-text)', lineHeight: 1.65, marginBottom: 16 }}>{quote}</p>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{name}</div>
                <div style={{ fontSize: 11, color: 'var(--sv-muted)' }}>{role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" style={{ padding: '80px 48px', borderTop: '1px solid var(--sv-border)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{
              fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em',
              color: 'var(--sv-accent)', marginBottom: 12,
            }}>Pricing</div>
            <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 14 }}>
              Simple, transparent pricing
            </h2>
            <p style={{ color: 'var(--sv-muted)', fontSize: 15 }}>
              Start free for 14 days. No credit card required.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[
              {
                name: 'Starter', price: '$29', accent: '#A78BFA',
                desc: 'Perfect for a single restaurant location.',
                features: [
                  '2 menu slots',
                  'Canva + Adobe Express embeds',
                  'Holiday scheduling',
                  'QR code generation',
                  'iframe embed snippet',
                  'Email support',
                ],
                cta: 'Start free trial', highlight: false,
              },
              {
                name: 'Pro', price: '$79', accent: 'var(--sv-accent)',
                desc: 'For multi-location owners who need more slots.',
                features: [
                  '6 menu slots',
                  'Everything in Starter',
                  'Make.com / Zapier webhook',
                  'Priority support',
                  'Custom slot names',
                  'Analytics dashboard',
                ],
                cta: 'Start free trial', highlight: true,
              },
              {
                name: 'Agency', price: '$199', accent: 'var(--sv-warning)',
                desc: 'For digital agencies managing multiple clients.',
                features: [
                  'Unlimited menu slots',
                  'Everything in Pro',
                  'Unlimited clients',
                  'White-label ready',
                  'API access',
                  'Dedicated support',
                ],
                cta: 'Contact us', highlight: false,
              },
            ].map(({ name, price, accent, desc, features, cta, highlight }) => (
              <div key={name} style={{
                background: highlight ? `linear-gradient(180deg, ${accent}12 0%, var(--sv-surface) 100%)` : 'var(--sv-surface)',
                border: `1px solid ${highlight ? accent : 'var(--sv-border)'}`,
                borderRadius: 16, padding: '32px 28px',
                position: 'relative',
                boxShadow: highlight ? `0 0 40px ${accent}20` : 'none',
              }}>
                {highlight && (
                  <div style={{
                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                    background: accent, color: '#fff', fontSize: 10, fontWeight: 800,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    padding: '4px 14px', borderRadius: 20,
                  }}>Most Popular</div>
                )}
                <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: accent, marginBottom: 8 }}>{name}</div>
                <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 6 }}>
                  {price}<span style={{ fontSize: 15, fontWeight: 400, color: 'var(--sv-muted)' }}>/mo</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--sv-muted)', marginBottom: 24, lineHeight: 1.5 }}>{desc}</p>
                <div style={{ marginBottom: 28 }}>
                  {features.map(f => (
                    <div key={f} style={{ display: 'flex', gap: 10, marginBottom: 9, fontSize: 13 }}>
                      <Check size={14} style={{ color: accent, flexShrink: 0, marginTop: 1 }} />
                      {f}
                    </div>
                  ))}
                </div>
                <Link href="/signup" className="btn" style={{
                  display: 'flex', justifyContent: 'center', width: '100%',
                  background: highlight ? accent : 'transparent',
                  border: `1px solid ${highlight ? accent : 'var(--sv-border)'}`,
                  color: highlight ? '#fff' : 'var(--sv-muted)',
                  padding: '11px',
                  boxShadow: highlight ? `0 4px 20px ${accent}40` : 'none',
                }}>
                  {cta}
                </Link>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', marginTop: 28, fontSize: 13, color: 'var(--sv-muted)' }}>
            All plans include a 14-day free trial · Cancel anytime · No setup fees
          </p>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{
        padding: '80px 48px', borderTop: '1px solid var(--sv-border)',
        background: 'var(--sv-surface)', textAlign: 'center',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 38, fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 16 }}>
            Your menu, always{' '}
            <span style={{
              background: 'linear-gradient(135deg, var(--sv-accent), var(--sv-accent-2))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>fresh</span>
          </h2>
          <p style={{ fontSize: 16, color: 'var(--sv-muted)', marginBottom: 36, lineHeight: 1.65 }}>
            Join restaurants that stopped waiting on developers and started publishing
            their own menus in seconds.
          </p>
          <Link href="/signup" className="btn btn-primary" style={{
            padding: '15px 40px', fontSize: 17,
            boxShadow: '0 8px 40px rgba(187,107,217,0.5)',
          }}>
            Start your free trial <ChevronRight size={17} />
          </Link>
          <p style={{ marginTop: 16, fontSize: 12, color: 'var(--sv-muted)' }}>
            14 days free · No credit card · Cancel anytime
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        padding: '40px 48px', borderTop: '1px solid var(--sv-border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: 12, color: 'var(--sv-muted)',
        flexWrap: 'wrap', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 900, fontSize: 14, color: 'var(--sv-text)' }}>
            Serv<span style={{ color: 'var(--sv-accent)' }}>vee</span>
          </span>
          <span>· Part of the BOOM B.A.A.R.S suite</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/login" style={{ color: 'inherit', textDecoration: 'none' }}>Sign in</Link>
          <Link href="/signup" style={{ color: 'inherit', textDecoration: 'none' }}>Sign up</Link>
          <a href="mailto:eric@boommedia.us" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</a>
          <Link href="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</Link>
          <Link href="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</Link>
        </div>
        <div>© 2026 BOOM Media. All rights reserved.</div>
      </footer>

    </div>
  )
}
