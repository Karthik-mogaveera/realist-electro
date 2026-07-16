// src/pages/ServicesPage.jsx
// ─────────────────────────────────────────────────────────────
// Public Services page — reached from header nav "Services".
// Two sections:
//   1. Services grid   — image, title, full_desc from services table
//   2. Deliverables    — bullet points from deliverables table
// ─────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// ── Skeleton card ─────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{
      borderRadius: '20px', overflow: 'hidden', background: 'white',
      boxShadow: '0 4px 24px rgba(26,35,50,0.07)',
      border: '1px solid rgba(26,35,50,0.06)'
    }}>
      <div style={{
        height: '240px',
        background: 'linear-gradient(90deg,#E5E7EB 25%,#F3F4F6 50%,#E5E7EB 75%)',
        backgroundSize: '200% 100%',
        animation: 'svcPageShimmer 1.5s infinite'
      }} />
      <div style={{ padding: '28px' }}>
        <div style={{ height: '22px', background: '#E5E7EB', borderRadius: '6px', width: '60%', marginBottom: '14px' }} />
        <div style={{ height: '14px', background: '#F3F4F6', borderRadius: '6px', marginBottom: '8px' }} />
        <div style={{ height: '14px', background: '#F3F4F6', borderRadius: '6px', width: '85%', marginBottom: '8px' }} />
        <div style={{ height: '14px', background: '#F3F4F6', borderRadius: '6px', width: '70%' }} />
      </div>
    </div>
  )
}

// ── Single service card ───────────────────────────────────────
function ServiceCard({ service, index }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [expanded, setExpanded]   = useState(false)
  const navigate  = useNavigate()

  // Truncate full_desc for "read more" behaviour
  const CHAR_LIMIT = 260
  const isLong     = (service.full_desc || '').length > CHAR_LIMIT
  const displayText = expanded || !isLong
    ? service.full_desc
    : service.full_desc.slice(0, CHAR_LIMIT).trimEnd() + '…'
const goToContact = () => {
  navigate('/contact')
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
  return (
    <div
      style={{
        borderRadius: '20px', overflow: 'hidden', background: 'white',
        boxShadow: '0 4px 24px rgba(26,35,50,0.07)',
        border: '1px solid rgba(26,35,50,0.06)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        animation: `svcCardIn 0.5s ${index * 0.08}s ease both`
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px)'
        e.currentTarget.style.boxShadow = '0 16px 48px rgba(26,35,50,0.13)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(26,35,50,0.07)'
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 'clamp(180px,22vw,260px)', overflow: 'hidden', background: '#E5E7EB' }}>
        {!imgLoaded && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg,#E5E7EB 25%,#F3F4F6 50%,#E5E7EB 75%)',
            backgroundSize: '200% 100%', animation: 'svcPageShimmer 1.5s infinite'
          }} />
        )}
        <img
          src={service.image_url}
          alt={service.title}
          onLoad={() => setImgLoaded(true)}
          onError={e => {
            setImgLoaded(true)
            e.target.src = `https://placehold.co/800x400/0B1F3A/14B8A6?text=${encodeURIComponent(service.title)}`
          }}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.4s ease'
          }}
        />
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(26,35,50,0.65) 0%, rgba(26,35,50,0.1) 55%, transparent 100%)'
        }} />
        {/* Title on image */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(16px,2.5vw,24px)' }}>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(17px,2.2vw,22px)',
            fontWeight: 700, color: 'white',
            lineHeight: 1.25, margin: 0,
            textShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}>{service.title}</h3>
        </div>
        {/* Teal accent bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0,
          width: '4px', height: '100%',
          background: 'linear-gradient(180deg, #F2994A, #D97D2B)'
        }} />
      </div>

      {/* Body */}
      <div style={{ padding: 'clamp(20px,2.5vw,28px)' }}>
        {service.full_desc ? (
          <>
            <p style={{
              color: '#3F4A5A',
              fontSize: 'clamp(13px,1.4vw,15px)',
              lineHeight: 1.85, margin: 0
            }}>{displayText}</p>
            {isLong && (
              <button
                onClick={() => setExpanded(e => !e)}
                style={{
                  marginTop: '12px', background: 'none', border: 'none',
                  cursor: 'pointer', color: '#F2994A',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(12px,1.2vw,13px)', fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: '5px', padding: 0
                }}
              >
                {expanded ? 'Show Less ↑' : 'Read More ↓'}
              </button>
            )}
          </>
        ) : (
          <p style={{ color: '#9CA3AF', fontSize: '14px', fontStyle: 'italic', margin: 0 }}>
            Detailed description coming soon.
          </p>
        )}

        {/* Enquire button */}
        <button
          onClick={goToContact}
          className="btn-primary"
          style={{
            marginTop: 'clamp(16px,2vw,22px)',
            padding: 'clamp(9px,1.2vw,11px) clamp(18px,2vw,24px)',
            borderRadius: '8px', border: 'none', cursor: 'pointer',
            fontSize: 'clamp(12px,1.2vw,13px)',
            display: 'inline-flex', alignItems: 'center', gap: '7px'
          }}
        >
          Enquire
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
//  SERVICES SECTION
// ══════════════════════════════════════════════════════════════
function ServicesListSection({ services, loading }) {
  return (
    <section style={{
      padding: 'clamp(56px,8vw,100px) clamp(16px,4vw,48px)',
      background: '#FAF7F2', position: 'relative', overflow: 'hidden'
    }}>
      {/* Watermark section number */}
      <div style={{
        position: 'absolute', left: '-1%', top: '50%', transform: 'translateY(-50%)',
        fontFamily: 'var(--font-display)', fontWeight: 800,
        fontSize: 'clamp(140px,18vw,260px)', color: 'rgba(242,153,74,0.06)',
        lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.05em',
      }}>01</div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Asymmetric header */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          marginBottom: 'clamp(36px,5vw,56px)', gap: '20px', flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#D97D2B', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>§ 01</span>
              <div style={{ width: '40px', height: '1px', background: 'rgba(242,153,74,0.4)' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#D97D2B', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>What We Do</span>
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(24px,4vw,44px)', fontWeight: 800, color: '#1A2332', lineHeight: 1.15,
            }}>Our Core Services</h2>
          </div>
          <p style={{ color: '#6B7280', fontSize: 'clamp(13px,1.3vw,15px)', maxWidth: '380px', lineHeight: 1.7 }}>
            End-to-end EPC expertise across power, energy, irrigation and industrial sectors
            — engineered to deliver.
          </p>
        </div>

        {/* Skeleton grid */}
        {loading && (
          <div className="svc-page-grid">
            {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty */}
        {!loading && services.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: '52px', marginBottom: '16px' }}>⚡</div>
            <h3 style={{ fontFamily: 'var(--font-display)', color: '#1A2332', marginBottom: '10px' }}>
              Services Coming Soon
            </h3>
            <p style={{ color: '#9CA3AF', fontSize: '15px' }}>
              Our services will be listed here once added from the admin panel.
            </p>
          </div>
        )}

        {/* Services grid */}
        {!loading && services.length > 0 && (
          <div className="svc-page-grid">
            {services.map((svc, i) => (
              <ServiceCard key={svc.id} service={svc} index={i} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .svc-page-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(18px, 2.5vw, 28px);
        }
        @media (max-width: 900px) {
          .svc-page-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 540px) {
          .svc-page-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════
//  DELIVERABLES SECTION
// ══════════════════════════════════════════════════════════════
function DeliverablesSection({ data, loading }) {
  // Parse "• line\n• line" into an array of strings
  const bullets = data
    ? data.content
        .split('\n')
        .map(l => l.replace(/^[•\-]\s*/, '').trim())
        .filter(l => l.length > 0)
    : []

  return (
    <section style={{
      padding: 'clamp(48px,7vw,90px) clamp(16px,3vw,24px)',
      background: 'linear-gradient(135deg, #1A2332 0%, #0d2a4a 100%)',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Decorative background dots */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04,
        backgroundImage: 'radial-gradient(circle at 1px 1px, #F2994A 1px, transparent 0)',
        backgroundSize: '32px 32px', pointerEvents: 'none'
      }} />
      {/* Teal glow */}
      <div style={{
        position: 'absolute', width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(242,153,74,0.12) 0%, transparent 70%)',
        top: '-100px', right: '-80px', pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Asymmetric header */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          marginBottom: 'clamp(32px,4vw,48px)', gap: '20px', flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#F2994A', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>§ 02</span>
              <div style={{ width: '40px', height: '1px', background: 'rgba(242,153,74,0.4)' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#F2994A', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>What We Deliver</span>
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(24px,4vw,44px)', fontWeight: 800, color: 'white', lineHeight: 1.15,
            }}>Our Deliverables</h2>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 'clamp(12px,1.3vw,15px)', maxWidth: '360px', lineHeight: 1.7 }}>
            Every project we undertake comes with a commitment to quality,
            precision, and on-time delivery.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '700px', margin: '0 auto' }}>
            {[100, 80, 90, 70, 85].map((w, i) => (
              <div key={i} style={{
                height: '20px', borderRadius: '6px',
                background: 'rgba(255,255,255,0.06)',
                width: `${w}%`,
                animation: 'svcPageShimmer 1.5s infinite'
              }} />
            ))}
          </div>
        )}

        {/* No data */}
        {!loading && bullets.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: '44px', marginBottom: '14px' }}>📋</div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px' }}>
              Deliverables will appear here once added from the admin panel.
            </p>
          </div>
        )}

        {/* Bullet grid */}
        {!loading && bullets.length > 0 && (
          <div className="dlv-page-grid">
            {bullets.map((point, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '16px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(242,153,74,0.15)',
                  borderRadius: '14px', padding: 'clamp(16px,2.2vw,22px)',
                  transition: 'all 0.25s ease',
                  animation: `svcCardIn 0.4s ${i * 0.06}s ease both`
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(242,153,74,0.08)'
                  e.currentTarget.style.borderColor = 'rgba(242,153,74,0.35)'
                  e.currentTarget.style.transform = 'translateX(4px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                  e.currentTarget.style.borderColor = 'rgba(242,153,74,0.15)'
                  e.currentTarget.style.transform = 'translateX(0)'
                }}
              >
                {/* Bullet icon */}
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(242,153,74,0.18)',
                  border: '1.5px solid rgba(242,153,74,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginTop: '1px'
                }}>
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#F2994A' }} />
                </div>
                {/* Text */}
                <p style={{
                  color: 'rgba(255,255,255,0.88)',
                  fontSize: 'clamp(13px,1.4vw,15px)',
                  lineHeight: 1.75, margin: 0, flex: 1
                }}>{point}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .dlv-page-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(12px, 1.8vw, 18px);
        }
        @media (max-width: 640px) {
          .dlv-page-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════
//  PAGE HERO BANNER — asymmetric, watermark word, angular accent
// ══════════════════════════════════════════════════════════════
// function PageHero() {
//   return (
//     <section style={{
//       position: 'relative', overflow: 'hidden',
//       background: 'linear-gradient(120deg, #060F1D 0%, #1A2332 55%, #0d2a4a 100%)',
//       padding: 'clamp(110px,15vw,150px) clamp(20px,5vw,64px) clamp(56px,7vw,80px)',
//     }}>
//       <div style={{
//         position: 'absolute', left: 0, top: 0, bottom: 0, width: '5px',
//         background: 'linear-gradient(180deg, #F2994A 0%, #D97D2B 100%)',
//       }} />
//       <div style={{
//         position: 'absolute', inset: 0, pointerEvents: 'none',
//         backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 44px, rgba(242,153,74,0.045) 44px, rgba(242,153,74,0.045) 45px)`,
//       }} />
//       <div style={{
//         position: 'absolute', right: 'clamp(-20px,-2vw,10px)', bottom: '-6%',
//         fontFamily: 'var(--font-display)', fontWeight: 800,
//         fontSize: 'clamp(80px,15vw,220px)', color: 'rgba(255,255,255,0.035)',
//         lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.03em',
//       }}>SERVICES</div>

//       <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
//         <div style={{ maxWidth: '680px' }}>
//           <div style={{
//             display: 'inline-flex', alignItems: 'center', gap: '10px',
//             padding: 'clamp(7px,1vw,9px) clamp(14px,2vw,18px)', borderRadius: '999px',
//             background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(242,153,74,0.4)',
//             marginBottom: 'clamp(22px,3vw,30px)', animation: 'fadeInUp 0.6s ease both',
//           }}>
//             <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F2994A', flexShrink: 0 }} />
//             <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(10px,1vw,11.5px)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>Home</span>
//             <span style={{ color: '#F2994A', fontSize: '11px' }}>/</span>
//             <span style={{ color: '#F2994A', fontSize: 'clamp(10px,1vw,11.5px)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>Services</span>
//           </div>

//           <h1 style={{
//             fontFamily: 'var(--font-display)',
//             fontSize: 'clamp(32px,5.6vw,64px)',
//             fontWeight: 800, color: 'white', lineHeight: 1.08,
//             marginBottom: 'clamp(18px,2.6vw,24px)',
//             animation: 'fadeInUp 0.7s 0.08s ease both',
//           }}>
//             Engineering Services{' '}
//             <span style={{
//               background: 'linear-gradient(90deg, #F2994A, #FFB870)',
//               WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
//             }}>Built to Last</span>
//           </h1>

//           <p style={{
//             color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(14px,1.6vw,17px)', lineHeight: 1.75,
//             maxWidth: '540px', animation: 'fadeInUp 0.7s 0.16s ease both',
//           }}>
//             Comprehensive EPC solutions in power, solar, irrigation and industrial engineering —
//             executed with precision from concept to commissioning.
//           </p>
//         </div>
//       </div>
//     </section>
//   )
// }

function PageHero() {
  return (
    <section style={{
      position: 'relative', overflow: 'hidden',
      padding: 'clamp(110px,15vw,150px) clamp(20px,5vw,64px) clamp(56px,7vw,80px)',
    }}>
      {/* ── Static hero image ─────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url('/images/trans.jpg')`, // ← swap in your image path/URL
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} />

      {/* Dark gradient overlay — keeps the image but restores text legibility */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(120deg, rgba(6,15,29,0.92) 0%, rgba(26,35,50,0.88) 55%, rgba(13,42,74,0.75) 100%)',
      }} />

      {/* Angular amber accent bar (unchanged) */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: '5px',
        background: 'linear-gradient(180deg, #F2994A 0%, #D97D2B 100%)',
        zIndex: 1,
      }} />

      {/* Diagonal hatch texture (unchanged) */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 44px, rgba(242,153,74,0.045) 44px, rgba(242,153,74,0.045) 45px)`,
      }} />

      {/* ...rest of the hero (watermark word, badge, heading, paragraph) stays exactly as-is,
           just make sure its wrapper div has style={{ position: 'relative', zIndex: 2, ... }} */}

      <div style={{
        position: 'absolute', right: 'clamp(-20px,-2vw,10px)', bottom: '-6%',
        fontFamily: 'var(--font-display)', fontWeight: 800,
        fontSize: 'clamp(80px,15vw,220px)', color: 'rgba(255,255,255,0.035)',
        lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.03em',
      }}>SERVICES</div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ maxWidth: '680px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: 'clamp(7px,1vw,9px) clamp(14px,2vw,18px)', borderRadius: '999px',
            background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(242,153,74,0.4)',
            marginBottom: 'clamp(22px,3vw,30px)', animation: 'fadeInUp 0.6s ease both',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F2994A', flexShrink: 0 }} />
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(10px,1vw,11.5px)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>Home</span>
            <span style={{ color: '#F2994A', fontSize: '11px' }}>/</span>
            <span style={{ color: '#F2994A', fontSize: 'clamp(10px,1vw,11.5px)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>Services</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px,5.6vw,64px)',
            fontWeight: 800, color: 'white', lineHeight: 1.08,
            marginBottom: 'clamp(18px,2.6vw,24px)',
            animation: 'fadeInUp 0.7s 0.08s ease both',
          }}>
            Committed to Quality, {' '}
            <span style={{
              background: 'linear-gradient(90deg, #F2994A, #FFB870)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Driven by Innovation Always</span>
          </h1>

          <p style={{
            color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(14px,1.6vw,17px)', lineHeight: 1.75,
            maxWidth: '540px', animation: 'fadeInUp 0.7s 0.16s ease both',
          }}>
            Comprehensive EPC solutions in power, solar, irrigation and industrial engineering —
            executed with precision from concept to commissioning.
          </p>
        </div>
      </div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════
//  PAGE ROOT
// ══════════════════════════════════════════════════════════════
export default function ServicesPage() {
  const [services,  setServices]  = useState([])
  const [svcLoad,   setSvcLoad]   = useState(true)
  const [dlvData,   setDlvData]   = useState(null)
  const [dlvLoad,   setDlvLoad]   = useState(true)

  // Scroll to top on mount
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [])

  // Fetch both in parallel
  useEffect(() => {
    axios.get(`${API_URL}/api/admin/services/public`)
      .then(({ data }) => { if (data.success) setServices(data.services || []) })
      .catch(() => {})
      .finally(() => setSvcLoad(false))

    axios.get(`${API_URL}/api/admin/deliverables`)
      .then(({ data }) => { if (data.success && data.data) setDlvData(data.data) })
      .catch(() => {})
      .finally(() => setDlvLoad(false))
  }, [])

  return (
    <>
      <PageHero />
      <ServicesListSection services={services} loading={svcLoad} />
      <DeliverablesSection data={dlvData} loading={dlvLoad} />

      <style>{`
        @keyframes svcPageShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes svcCardIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}