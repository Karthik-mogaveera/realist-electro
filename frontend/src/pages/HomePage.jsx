// src/pages/HomePage.jsx — VISUAL REDESIGN (same palette, new design language)
// Split hero · Amber stats strip · Watermark-number about · Service table rows
// Reversed section ordering · Angular / blueprint aesthetic
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// ── Color aliases (exact values — DO NOT CHANGE) ──────────────
const INK    = '#1A2332'
const AMBER  = '#F2994A'
const AMBER2 = '#FFB870'
const AMBER3 = '#D97D2B'
const CREAM  = '#FAF7F2'
const BODY   = '#3F4A5A'
const STEEL  = '#5B7C99'
const SLATE  = '#F0F4F8'

const FALLBACK_SLIDES = [
  { image_url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1600&q=80', title: 'Electrical Substations & Transmission', subject: 'Up to 220 KV System Voltage' },
  { image_url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1600&q=80', title: 'Solar Power Plants', subject: 'MW Scale — Design, Erection & Commissioning' },
  { image_url: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1600&q=80', title: 'Irrigation & Lift Irrigation Systems', subject: 'Large Scale EPC Contracts' },
  { image_url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1600&q=80', title: 'Industrial Engineering', subject: 'India & International Experience' },
]

const STATS = [
  { label: 'EPC Projects Delivered', value: '50+' },
  { label: 'KV Max System Voltage',  value: '220' },
  { label: 'MW Solar Capacity',      value: '100+' },
]

// ══════════════════════════════════════════════════════════════
//  HERO — split-panel: left text / right image
// ══════════════════════════════════════════════════════════════
function HeroSlider() {
  const [slides, setSlides]   = useState(FALLBACK_SLIDES)
  const [current, setCurrent] = useState(0)
  const timerRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`${API_URL}/api/admin/slideshow/public`)
      .then(({ data }) => { if (data.success && data.slides.length > 0) setSlides(data.slides) })
      .catch(() => {})
  }, [])

  const startTimer = (total) => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % total), 5500)
  }
  useEffect(() => { startTimer(slides.length); return () => clearInterval(timerRef.current) }, [slides])

  const goTo = (i) => { clearInterval(timerRef.current); setCurrent(i); startTimer(slides.length) }
  const active = slides[current] || slides[0]

  const go = (path) => { navigate(path); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  return (
    <section
      className="hp-hero"
      style={{
        position: 'relative', overflow: 'hidden',
        padding: 'clamp(110px,15vw,150px) clamp(20px,5vw,64px) clamp(90px,10vw,120px)',
      }}
    >
      {/* ── Background slides (same layer pattern as PageHero's static image) ── */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {slides.map((slide, i) => (
          <div
            key={slide.id || i}
            className={`hero-slide ${i === current ? 'active' : ''}`}
            style={{
              backgroundImage: `url(${slide.image_url})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
            }}
          />
        ))}
      </div>

      {/* Dark gradient overlay — identical treatment to PageHero */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(120deg, rgba(6, 15, 29, 0.92) 0%, rgba(26, 35, 50, 0.4) 55%, rgba(13, 42, 74, 0.08) 100%)`,
      }} />

      {/* Angular amber accent bar */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: '5px',
        background: `linear-gradient(180deg, ${AMBER} 0%, ${AMBER3} 100%)`,
        zIndex: 1,
      }} />

      {/* Diagonal hatch texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 44px, rgba(242,153,74,0.045) 44px, rgba(242,153,74,0.045) 45px)`,
      }} />

      {/* Giant watermark word */}
      <div style={{
        position: 'absolute', right: 'clamp(-20px,-2vw,10px)', bottom: '-6%',
        fontFamily: 'var(--font-display)', fontWeight: 800,
        fontSize: 'clamp(90px,16vw,240px)', color: 'rgba(255,255,255,0.035)',
        lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.03em',
      }}>HOME</div>

      {/* ── CONTENT ──────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ maxWidth: '680px' }}>

          {/* Eyebrow badge — same shape/markup as PageHero's breadcrumb badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: 'clamp(7px,1vw,9px) clamp(14px,2vw,18px)', borderRadius: '999px',
            background: 'rgba(255,255,255,0.07)', border: `1px solid rgba(242,153,74,0.4)`,
            marginBottom: 'clamp(22px,3vw,30px)', animation: 'fadeInUp 0.6s ease both',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: AMBER, flexShrink: 0 }} />
            <span style={{
              color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(10px,1vw,11.5px)', fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'var(--font-body)',
            }}>Est. 2008</span>
            <span style={{ color: AMBER, fontSize: '11px' }}>/</span>
            <span style={{
              color: AMBER, fontSize: 'clamp(10px,1vw,11.5px)', fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'var(--font-body)',
            }}>Bengaluru, Karnataka</span>
          </div>

          {/* Heading */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px,5.6vw,64px)',
            fontWeight: 800, lineHeight: 1.08,
            marginBottom: 'clamp(18px,2.6vw,24px)',
            animation: 'fadeInUp 0.7s 0.08s ease both',
          }}>
            <span style={{ color: 'white' }}>Trusted </span>
            <span style={{
              background: `linear-gradient(90deg, ${AMBER}, ${AMBER2})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Engineering,</span>
            <span style={{
              color: 'rgba(255,255,255,0.4)', display: 'block', fontWeight: 700,
              fontSize: '0.42em', letterSpacing: '0.14em', marginTop: 'clamp(6px,1vw,10px)',
            }}>Proven Excellence Always</span>
          </h1>

          {/* Active slide callout */}
          <div style={{
            borderLeft: `3px solid ${AMBER}`, paddingLeft: 'clamp(14px,1.8vw,18px)',
            marginBottom: 'clamp(28px,4vw,36px)', animation: 'fadeInUp 0.7s 0.16s ease both',
          }}>
            <p style={{
              color: 'rgba(255,255,255,0.9)', fontSize: 'clamp(14px,1.7vw,18px)',
              fontWeight: 500, marginBottom: '4px', lineHeight: 1.4,
            }}>{active.title}</p>
            <p style={{
              color: AMBER, fontSize: 'clamp(11.5px,1.2vw,13.5px)',
              fontWeight: 600, letterSpacing: '0.04em',
            }}>{active.subject}</p>
          </div>

          {/* CTA buttons */}
          <div style={{
            display: 'flex', gap: 'clamp(10px,1.5vw,14px)', flexWrap: 'wrap',
            marginBottom: 'clamp(28px,4vw,36px)', animation: 'fadeInUp 0.7s 0.24s ease both',
          }}>
            <button
              onClick={() => go('/services')}
              className="btn-primary"
              style={{
                padding: 'clamp(13px,1.6vw,16px) clamp(26px,3.2vw,36px)',
                borderRadius: '8px', border: 'none', cursor: 'pointer',
                fontSize: 'clamp(13px,1.2vw,15px)', letterSpacing: '0.03em',
                boxShadow: '0 12px 32px rgba(0,0,0,0.28)',
              }}
            >Explore Services →</button>

            <button
              onClick={() => go('/about')}
              style={{
                background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.85)',
                border: '1.5px solid rgba(255,255,255,0.25)',
                borderRadius: '8px', padding: 'clamp(13px,1.6vw,16px) clamp(26px,3.2vw,36px)',
                fontSize: 'clamp(13px,1.2vw,15px)', fontFamily: 'var(--font-body)',
                fontWeight: 500, cursor: 'pointer', transition: 'all 0.25s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = AMBER; e.currentTarget.style.color = AMBER; e.currentTarget.style.background = 'rgba(242,153,74,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
            >About SMEE</button>
          </div>

          {/* Trust line */}
          <p style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            color: 'rgba(255,255,255,0.45)', fontSize: 'clamp(11px,1.1vw,12.5px)',
            fontFamily: 'var(--font-body)', letterSpacing: '0.02em',
            animation: 'fadeInUp 0.7s 0.32s ease both',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={AMBER} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Authorized Super Grade Electrical Contractor · Licensed by Govt. of Karnataka
          </p>
        </div>
      </div>

      {/* Slide counter + progress dots */}
      <div className="hp-hero-dots" style={{
        position: 'absolute', zIndex: 2,
        bottom: 'clamp(20px,3vw,32px)', right: 'clamp(20px,5vw,64px)',
        display: 'flex', alignItems: 'center', gap: 'clamp(10px,1.5vw,16px)',
      }}>
        <span style={{
          color: 'rgba(255,255,255,0.35)', fontSize: '11px',
          fontFamily: 'var(--font-body)', letterSpacing: '0.12em',
        }}>
          {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </span>
        <div style={{ display: 'flex', gap: '5px' }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} aria-label={`Go to slide ${i + 1}`} style={{
              width: i === current ? '30px' : '8px', height: '3px',
              background: i === current ? AMBER : 'rgba(255,255,255,0.25)',
              border: 'none', borderRadius: '2px', cursor: 'pointer',
              padding: 0, transition: 'all 0.35s ease',
            }} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .hp-hero-dots { display: none !important; }
        }
      `}</style>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════
//  STATS — amber background, reversed from original dark strip
// ══════════════════════════════════════════════════════════════
function StatsBar() {
  return (
    <div style={{ background: AMBER }}>
      <div style={{
        maxWidth: '1280px', margin: '0 auto',
        display: 'grid', gridTemplateColumns: `repeat(${STATS.length}, 1fr)`,
      }} className="hp-stats">
        {STATS.map((s, i) => (
          <div key={i} style={{
            padding: 'clamp(22px,3vw,36px) clamp(16px,2.5vw,32px)',
            textAlign: 'center',
            borderRight: i < STATS.length - 1 ? `1px solid rgba(26,35,50,0.18)` : 'none',
            display: 'flex', flexDirection: 'column', gap: '4px',
          }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px,4.5vw,54px)',
              fontWeight: 800, color: INK, lineHeight: 1, letterSpacing: '-0.02em',
            }}>{s.value}</div>
            {/* Thin rule under number */}
            <div style={{ width: '28px', height: '2px', background: `rgba(26,35,50,0.35)`, margin: '6px auto' }} />
            <div style={{
              color: 'rgba(26,35,50,0.65)', fontSize: 'clamp(9px,1.1vw,12px)',
              fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase',
              fontFamily: 'var(--font-body)',
            }}>{s.label}</div>
          </div>
        ))}
      </div>
      <style>{`
        @media (max-width: 520px) {
          .hp-stats { grid-template-columns: 1fr !important; }
          .hp-stats > div { border-right: none !important; border-top: 1px solid rgba(26,35,50,0.12); }
          .hp-stats > div:first-child { border-top: none; }
        }
      `}</style>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
//  ABOUT — cream bg, watermark section number, credential strip
// ══════════════════════════════════════════════════════════════
function AboutSection() {
  const [expanded, setExpanded]         = useState(false)
  const [aboutContent, setAboutContent] = useState('')
  const [loading, setLoading]           = useState(true)
  const yearsOfExcellence = new Date().getFullYear() - 2008

  useEffect(() => {
    axios.get(`${API_URL}/api/admin/whoweare`)
      .then(({ data }) => { if (data.success && data.data) setAboutContent(data.data.content) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section style={{ background: CREAM, position: 'relative', overflow: 'hidden' }}>

      {/* Big section watermark number */}
      <div style={{
        position: 'absolute', left: '-1%', top: '50%', transform: 'translateY(-50%)',
        fontFamily: 'var(--font-display)', fontWeight: 800,
        fontSize: 'clamp(160px,20vw,280px)',
        color: `rgba(242,153,74,0.07)`,
        lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.05em',
      }}>01</div>

      <div style={{
        maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1,
        padding: 'clamp(56px,9vw,112px) clamp(24px,4vw,48px)',
      }}>

        {/* Section label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '48px' }}>
          <span style={{
            fontSize: '11px', fontWeight: 700, color: AMBER3,
            letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-body)',
          }}>§ 01</span>
          <div style={{ flex: 1, height: '1px', background: `rgba(242,153,74,0.25)` }} />
          <span style={{
            fontSize: '11px', fontWeight: 700, color: AMBER3,
            letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-body)',
          }}>Who We Are</span>
        </div>

        {/* 2-col: heading + credentials LEFT · body text RIGHT */}
        <div className="hp-about" style={{
          display: 'grid', gridTemplateColumns: '42% 1fr', gap: 'clamp(32px,5vw,80px)', alignItems: 'start',
        }}>

          {/* LEFT */}
          <div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(22px,3.8vw,44px)',
              fontWeight: 800, color: INK, lineHeight: 1.1,
              marginBottom: '36px', letterSpacing: '-0.01em',
            }}>
              Sri Maheshwari<br />
              <span style={{ color: AMBER }}>Engineering</span><br />
              Enterprises
            </h2>

            {/* Horizontal credential strip */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Year strip */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '18px',
                padding: '18px 22px',
                borderLeft: `4px solid ${AMBER}`,
                background: 'white',
                boxShadow: '0 2px 12px rgba(26,35,50,0.06)',
              }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(36px,5vw,56px)',
                  fontWeight: 800, color: AMBER, lineHeight: 1,
                }}>{yearsOfExcellence}</div>
                <div>
                  <div style={{ color: INK, fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Years of</div>
                  <div style={{ color: BODY, fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Excellence</div>
                  <div style={{ color: STEEL, fontSize: '11px', marginTop: '3px' }}>2008 – {new Date().getFullYear()}</div>
                </div>
              </div>

              {/* Govt badge strip */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '15px 22px',
                borderLeft: `4px solid ${STEEL}`,
                background: 'white',
                boxShadow: '0 2px 12px rgba(26,35,50,0.06)',
              }}>
                <span style={{ fontSize: '24px', lineHeight: 1 }}>🏆</span>
                <div>
                  <div style={{ color: INK, fontSize: '13px', fontWeight: 700 }}>Super Grade Electrical Contractor</div>
                  <div style={{ color: STEEL, fontSize: '11px', marginTop: '2px', letterSpacing: '0.03em' }}>Government of Karnataka</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — body text, no card border */}
          <div style={{ paddingTop: '8px' }}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[100,90,95,80,85].map((w, i) => (
                  <div key={i} style={{
                    height: '15px', borderRadius: '3px',
                    background: `rgba(242,153,74,0.12)`, width: `${w}%`,
                    animation: 'shimmer 1.5s infinite',
                  }} />
                ))}
              </div>
            ) : (
              <>
                <div className={`expandable-text ${expanded ? 'expanded' : 'collapsed'}`}>
                  {aboutContent.split(/\n\s*\n/).filter(p => p.trim()).map((para, i) => (
                    <p key={i} style={{
                      color: BODY, fontSize: 'clamp(14px,1.5vw,17px)',
                      lineHeight: 1.9, marginBottom: '18px', fontFamily: 'var(--font-body)',
                    }}>{para}</p>
                  ))}
                </div>
                {aboutContent && (
                  <button
                    onClick={() => setExpanded(e => !e)}
                    style={{
                      marginTop: '16px', background: 'none', border: 'none',
                      cursor: 'pointer', color: AMBER3,
                      fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 700,
                      display: 'flex', alignItems: 'center', gap: '8px', padding: 0,
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                    }}
                  >
                    {expanded ? 'Show Less ↑' : 'Read More ↓'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .hp-about { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════
//  SERVICES — magazine 2-col thumbnail grid (not accordion rows)
// ══════════════════════════════════════════════════════════════
function ServicesSection() {
  const [services, setServices]    = useState([])
  const [loading, setLoading]      = useState(true)
  const [activeService, setActive] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`${API_URL}/api/admin/services/public`)
      .then(({ data }) => { if (data.success) setServices(data.services) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const goToContact = () => { navigate('/contact'); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const activeData = services.find(s => s.id === activeService)

  if (loading) return (
    <section style={{ background: INK, padding: 'clamp(56px,8vw,100px) clamp(24px,4vw,48px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ height: '42px', borderRadius: '3px', background: 'rgba(255,255,255,0.08)', width: '240px', marginBottom: '40px', animation: 'shimmer 1.5s infinite' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2px' }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ height: '220px', background: 'rgba(255,255,255,0.05)', animation: 'shimmer 1.5s infinite' }} />
          ))}
        </div>
      </div>
    </section>
  )

  if (!loading && services.length === 0) return (
    <section style={{ background: INK, padding: 'clamp(56px,8vw,100px) clamp(24px,4vw,48px)', textAlign: 'center' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 0' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚡</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,3vw,36px)', color: 'white', marginBottom: '12px' }}>Our Core Areas of Expertise</h2>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '16px' }}>Services will appear here once added from the admin panel.</p>
      </div>
    </section>
  )

  return (
    <section style={{
      background: INK, position: 'relative', overflow: 'hidden',
      padding: 'clamp(56px,8vw,100px) clamp(24px,4vw,48px)',
    }}>
      {/* Diagonal blueprint hatching on dark bg */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `repeating-linear-gradient(
          -60deg,
          transparent, transparent 60px,
          rgba(242,153,74,0.03) 60px, rgba(242,153,74,0.03) 61px
        )`,
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'clamp(32px,4vw,52px)', gap: '20px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: AMBER, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>§ 02</span>
              <div style={{ width: '40px', height: '1px', background: `rgba(242,153,74,0.4)` }} />
              <span style={{ fontSize: '11px', fontWeight: 700, color: AMBER, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>What We Do</span>
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(24px,4vw,46px)',
              fontWeight: 800, color: 'white', letterSpacing: '-0.01em',
            }}>Core Areas of Expertise</h2>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 'clamp(12px,1.3vw,15px)', maxWidth: '380px', lineHeight: 1.7, fontFamily: 'var(--font-body)' }}>
            Engineering excellence across power, energy, and infrastructure — concept to commissioning.
          </p>
        </div>

        {/* 2-col photo grid — magazine masonry style */}
        <div className="hp-svc-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '3px' }}>
          {services.map((svc, i) => {
            const isActive = activeService === svc.id
            return (
              <div
                key={svc.id}
                onClick={() => setActive(p => p === svc.id ? null : svc.id)}
                style={{
                  position: 'relative', cursor: 'pointer',
                  height: i % 3 === 0 ? 'clamp(260px,30vw,380px)' : 'clamp(200px,22vw,280px)',
                  overflow: 'hidden',
                  outline: isActive ? `3px solid ${AMBER}` : '3px solid transparent',
                  outlineOffset: '-3px', transition: 'outline 0.2s',
                }}
              >
                <img
                  src={svc.image_url} alt={svc.title}
                  style={{
                    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                    transition: 'transform 0.55s ease',
                    transform: isActive ? 'scale(1.06)' : 'scale(1)',
                  }}
                  onError={e => { e.target.src = `https://placehold.co/600x340/${INK.slice(1)}/F2994A?text=${encodeURIComponent(svc.title)}` }}
                />
                {/* Gradient overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: isActive
                    ? `linear-gradient(to top, rgba(26,35,50,0.92) 0%, rgba(242,153,74,0.2) 100%)`
                    : `linear-gradient(to top, rgba(26,35,50,0.8) 0%, rgba(26,35,50,0.15) 60%, transparent 100%)`,
                  transition: 'background 0.35s',
                }} />
                {/* Text overlay */}
                <div style={{
                  position: 'absolute', inset: 0, padding: 'clamp(16px,2vw,28px)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                }}>
                  {/* Index number */}
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(11px,1.2vw,14px)', fontWeight: 800,
                    color: AMBER, letterSpacing: '0.12em', marginBottom: '6px',
                  }}>{String(i + 1).padStart(2, '0')}</span>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(14px,2vw,22px)', fontWeight: 700,
                    color: 'white', lineHeight: 1.2, marginBottom: '6px',
                  }}>{svc.title}</h3>
                  {svc.short_desc && (
                    <p style={{
                      color: 'rgba(255,255,255,0.65)', fontSize: 'clamp(11px,1.1vw,13px)',
                      lineHeight: 1.55, marginBottom: '10px',
                      maxHeight: isActive ? '100px' : '0', overflow: 'hidden',
                      transition: 'max-height 0.35s', fontFamily: 'var(--font-body)',
                    }}>{svc.short_desc}</p>
                  )}
                  {svc.full_desc && (
                    <span style={{
                      fontSize: 'clamp(10px,1vw,12px)', color: AMBER2, fontWeight: 700,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      display: 'flex', alignItems: 'center', gap: '5px',
                    }}>
                      {isActive ? 'Close ✕' : 'Details →'}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Detail panel — horizontal, below grid */}
        {activeData && activeData.full_desc && (
          <div className="service-detail visible" style={{ marginTop: '3px' }}>
            <div className="hp-svc-panel" style={{
              background: CREAM, display: 'grid', gridTemplateColumns: '1fr 1fr',
            }}>
              <div style={{ position: 'relative', minHeight: 'clamp(200px,25vw,300px)' }}>
                <img
                  src={activeData.image_url} alt={activeData.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={e => { e.target.src = `https://placehold.co/600x400/${INK.slice(1)}/F2994A?text=${encodeURIComponent(activeData.title)}` }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `linear-gradient(135deg, rgba(26,35,50,0.55) 0%, transparent 65%)`,
                }} />
                <div style={{ position: 'absolute', bottom: '24px', left: '24px' }}>
                  <div style={{ width: '28px', height: '3px', background: AMBER, marginBottom: '8px' }} />
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(16px,2.2vw,26px)', fontWeight: 700, color: 'white',
                  }}>{activeData.title}</h3>
                </div>
              </div>
              <div style={{ padding: 'clamp(24px,3vw,44px)', borderLeft: `4px solid ${AMBER}` }}>
                <span style={{
                  fontSize: '10px', fontWeight: 700, color: AMBER3,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  fontFamily: 'var(--font-body)', display: 'block', marginBottom: '14px',
                }}>Service Detail</span>
                <p style={{
                  color: BODY, fontSize: 'clamp(13px,1.5vw,16px)',
                  lineHeight: 1.9, fontFamily: 'var(--font-body)',
                }}>{activeData.full_desc}</p>
                <button
                  onClick={goToContact}
                  className="btn-primary"
                  style={{
                    marginTop: 'clamp(20px,2.5vw,32px)',
                    padding: 'clamp(10px,1.3vw,13px) clamp(20px,2.5vw,28px)',
                    borderRadius: '4px', border: 'none', cursor: 'pointer',
                    fontSize: 'clamp(12px,1.2vw,14px)', letterSpacing: '0.04em',
                  }}
                >Enquire About This Service →</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 700px) {
          .hp-svc-grid { grid-template-columns: 1fr !important; }
          .hp-svc-panel { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════
//  CLIENTS — cream bg (reversed from original dark section)
// ══════════════════════════════════════════════════════════════
function ClientCard({ client }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', overflow: 'hidden',
        width: 'clamp(110px,14vw,150px)', height: 'clamp(78px,10vw,108px)',
        background: hovered ? 'white' : CREAM, flexShrink: 0,
        border: `1.5px solid ${hovered ? AMBER : 'rgba(26,35,50,0.1)'}`,
        borderRadius: '4px',
        boxShadow: hovered ? `0 6px 24px rgba(242,153,74,0.18)` : 'none',
        transition: 'all 0.3s',
      }}
    >
      <img
        src={client.image_url} alt={client.name}
        style={{
          width: '100%', height: '100%', objectFit: 'contain', padding: '10px',
          transition: 'opacity 0.3s, transform 0.3s',
          opacity: hovered ? 0.3 : 1, transform: hovered ? 'scale(0.85)' : 'scale(1)',
        }}
        onError={e => { e.target.style.display = 'none' }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px',
        opacity: hovered ? 1 : 0, transition: 'opacity 0.3s',
      }}>
        <span style={{
          color: AMBER3, fontSize: 'clamp(9px,1vw,11px)',
          fontWeight: 700, textAlign: 'center', fontFamily: 'var(--font-body)',
          lineHeight: 1.3, letterSpacing: '0.03em',
        }}>{client.name}</span>
      </div>
    </div>
  )
}

function SupplyVendorCard({ vendor }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', overflow: 'hidden',
        width: 'clamp(110px,14vw,150px)', height: 'clamp(78px,10vw,108px)',
        background: hovered ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)',
        flexShrink: 0,
        border: `1.5px solid ${hovered ? AMBER : 'rgba(255,255,255,0.1)'}`,
        borderRadius: '4px',
        boxShadow: hovered ? `0 6px 24px rgba(242,153,74,0.2)` : 'none',
        transition: 'all 0.3s',
      }}
    >
      <img
        src={vendor.image_url} alt={vendor.name}
        style={{
          width: '100%', height: '100%', objectFit: 'contain', padding: '10px',
          transition: 'opacity 0.3s, transform 0.3s',
          opacity: hovered ? 0.3 : 0.85, transform: hovered ? 'scale(0.85)' : 'scale(1)',
        }}
        onError={e => { e.target.style.display = 'none' }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px',
        opacity: hovered ? 1 : 0, transition: 'opacity 0.3s',
      }}>
        <span style={{
          color: AMBER2, fontSize: 'clamp(9px,1vw,11px)',
          fontWeight: 700, textAlign: 'center', fontFamily: 'var(--font-body)', lineHeight: 1.3,
        }}>{vendor.name}</span>
      </div>
    </div>
  )
}

function ClientsSection() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${API_URL}/api/admin/clients/public`)
      .then(({ data }) => { if (data.success && data.clients.length > 0) setClients(data.clients) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section style={{ background: CREAM, padding: 'clamp(48px,7vw,88px) clamp(24px,4vw,48px)' }}>
      {/* Top amber rule */}
      <div style={{ height: '3px', background: `linear-gradient(90deg, ${AMBER}, ${AMBER2}, transparent)`, marginBottom: 'clamp(32px,4vw,52px)' }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'clamp(28px,4vw,44px)', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: AMBER3, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>§ 03 · Trusted By</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,3.5vw,40px)', fontWeight: 800, color: INK }}>Our Valued Clients</h2>
          </div>
          <div style={{ width: '60px', height: '3px', background: AMBER, alignSelf: 'flex-end', marginBottom: '8px' }} />
        </div>

        {loading && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} style={{
                width: 'clamp(110px,14vw,150px)', height: 'clamp(78px,10vw,108px)',
                borderRadius: '4px', background: `rgba(242,153,74,0.08)`,
                border: `1.5px solid rgba(26,35,50,0.08)`,
                animation: 'shimmer 1.5s infinite',
              }} />
            ))}
          </div>
        )}
        {!loading && clients.length === 0 && (
          <div style={{ padding: '40px 0', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🤝</div>
            <p style={{ color: STEEL, fontSize: '14px', fontFamily: 'var(--font-body)' }}>Client logos will appear here once added from the admin panel.</p>
          </div>
        )}
        {!loading && clients.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(8px,1.2vw,12px)' }}>
            {clients.map(c => <ClientCard key={c.id} client={c} />)}
          </div>
        )}
      </div>
      {/* Bottom amber rule */}
      <div style={{ height: '3px', background: `linear-gradient(90deg, transparent, ${AMBER2}, ${AMBER})`, marginTop: 'clamp(32px,4vw,52px)' }} />
    </section>
  )
}

function SupplyVendorsSection() {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${API_URL}/api/admin/supply-vendors/public`)
      .then(({ data }) => { if (data.success && data.vendors.length > 0) setVendors(data.vendors) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section style={{ background: INK, padding: 'clamp(48px,7vw,88px) clamp(24px,4vw,48px)', position: 'relative', overflow: 'hidden' }}>
      {/* Watermark text */}
      <div style={{
        position: 'absolute', right: '-2%', bottom: '-5%',
        fontFamily: 'var(--font-display)', fontWeight: 800,
        fontSize: 'clamp(100px,14vw,200px)', color: 'rgba(255,255,255,0.03)',
        lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
      }}>SUPPLY</div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'clamp(28px,4vw,44px)', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: AMBER, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>§ 04 · Supply Network</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,3.5vw,40px)', fontWeight: 800, color: 'white' }}>Our Supply Vendors</h2>
          </div>
          <div style={{ width: '60px', height: '3px', background: AMBER, alignSelf: 'flex-end', marginBottom: '8px' }} />
        </div>

        {loading && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{
                width: 'clamp(110px,14vw,150px)', height: 'clamp(78px,10vw,108px)',
                borderRadius: '4px', background: 'rgba(255,255,255,0.05)',
                border: '1.5px solid rgba(255,255,255,0.08)',
                animation: 'shimmer 1.5s infinite',
              }} />
            ))}
          </div>
        )}
        {!loading && vendors.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏭</div>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px', fontFamily: 'var(--font-body)' }}>Supply vendor logos will appear here once added from the admin panel.</p>
          </div>
        )}
        {!loading && vendors.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(8px,1.2vw,12px)' }}>
            {vendors.map(v => <SupplyVendorCard key={v.id} vendor={v} />)}
          </div>
        )}
      </div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════
//  HOME PAGE ROOT
// ══════════════════════════════════════════════════════════════
export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <StatsBar />
      <AboutSection />
      <ServicesSection />
      <ClientsSection />
      <SupplyVendorsSection />
    </>
  )
}