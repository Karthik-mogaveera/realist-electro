// src/pages/AboutPage.jsx
// ─────────────────────────────────────────────────────────────
// Public About page — reached from header nav "About".
// Three sections:
//   1. Company        — content from about_company table
//   2. Performance    — financial trend chart from business_performance
//   3. People         — team cards from about_people table
// ─────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// ── INR formatting helper ──────────────────────────────────────
function formatINR(value) {
  if (value === null || value === undefined) return ''
  const cleaned = value.toString().replace(/[^0-9.]/g, '')
  if (!cleaned) return value.toString()
  const [intPart, decPart] = cleaned.split('.')
  let last3 = intPart.slice(-3)
  let other = intPart.slice(0, -3)
  if (other !== '') last3 = ',' + last3
  const formatted = other.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + last3
  return decPart ? `${formatted}.${decPart}` : formatted
}

// Convert a turnover string to a plain number for chart scaling
function toNumber(value) {
  if (value === null || value === undefined) return 0
  const cleaned = value.toString().replace(/[^0-9.]/g, '')
  return cleaned ? parseFloat(cleaned) : 0
}

// Compact display: 12,50,00,000 -> ₹12.5 Cr
function compactINR(num) {
  if (num >= 1e7) return `₹${(num / 1e7).toFixed(2).replace(/\.00$/, '')} Cr`
  if (num >= 1e5) return `₹${(num / 1e5).toFixed(2).replace(/\.00$/, '')} L`
  return `₹${formatINR(num)}`
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
//       {/* Angular amber accent bar */}
//       <div style={{
//         position: 'absolute', left: 0, top: 0, bottom: 0, width: '5px',
//         background: 'linear-gradient(180deg, #F2994A 0%, #D97D2B 100%)',
//       }} />

//       {/* Diagonal hatch texture */}
//       <div style={{
//         position: 'absolute', inset: 0, pointerEvents: 'none',
//         backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 44px, rgba(242,153,74,0.045) 44px, rgba(242,153,74,0.045) 45px)`,
//       }} />

//       {/* Giant watermark word */}
//       <div style={{
//         position: 'absolute', right: 'clamp(-20px,-2vw,10px)', bottom: '-6%',
//         fontFamily: 'var(--font-display)', fontWeight: 800,
//         fontSize: 'clamp(90px,16vw,240px)', color: 'rgba(255,255,255,0.035)',
//         lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.03em',
//       }}>ABOUT</div>

//       <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
//         <div style={{ maxWidth: '680px' }}>
//           {/* Breadcrumb badge */}
//           <div style={{
//             display: 'inline-flex', alignItems: 'center', gap: '10px',
//             padding: 'clamp(7px,1vw,9px) clamp(14px,2vw,18px)', borderRadius: '999px',
//             background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(242,153,74,0.4)',
//             marginBottom: 'clamp(22px,3vw,30px)', animation: 'fadeInUp 0.6s ease both',
//           }}>
//             <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F2994A', flexShrink: 0 }} />
//             <span style={{
//               color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(10px,1vw,11.5px)', fontWeight: 700,
//               letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'var(--font-body)',
//             }}>Home</span>
//             <span style={{ color: '#F2994A', fontSize: '11px' }}>/</span>
//             <span style={{
//               color: '#F2994A', fontSize: 'clamp(10px,1vw,11.5px)', fontWeight: 700,
//               letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'var(--font-body)',
//             }}>About</span>
//           </div>

//           <h1 style={{
//             fontFamily: 'var(--font-display)',
//             fontSize: 'clamp(32px,5.6vw,64px)',
//             fontWeight: 800, color: 'white', lineHeight: 1.08,
//             marginBottom: 'clamp(18px,2.6vw,24px)',
//             animation: 'fadeInUp 0.7s 0.08s ease both',
//           }}>
//             Built on Trust,{' '}
//             <span style={{
//               background: 'linear-gradient(90deg, #F2994A, #FFB870)',
//               WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
//             }}>Driven by Excellence</span>
//           </h1>

//           <p style={{
//             color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(14px,1.6vw,17px)', lineHeight: 1.75,
//             maxWidth: '540px', animation: 'fadeInUp 0.7s 0.16s ease both',
//           }}>
//             Get to know Realist Electro Controls Pvt Ltd — our story,
//             our performance, and the people behind every project.
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
        backgroundImage: `url('/images/sub-station.jpg')`, // ← swap in your image path/URL
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
      {/* Giant watermark word */}
    <div style={{
        position: 'absolute', right: 'clamp(-20px,-2vw,10px)', bottom: '-6%',
        fontFamily: 'var(--font-display)', fontWeight: 800,
        fontSize: 'clamp(90px,16vw,240px)', color: 'rgba(255,255,255,0.035)',
        lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.03em',
      }}>ABOUT</div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ maxWidth: '680px' }}>
          {/* Breadcrumb badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: 'clamp(7px,1vw,9px) clamp(14px,2vw,18px)', borderRadius: '999px',
            background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(242,153,74,0.4)',
            marginBottom: 'clamp(22px,3vw,30px)', animation: 'fadeInUp 0.6s ease both',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F2994A', flexShrink: 0 }} />
            <span style={{
              color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(10px,1vw,11.5px)', fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'var(--font-body)',
            }}>Home</span>
            <span style={{ color: '#F2994A', fontSize: '11px' }}>/</span>
            <span style={{
              color: '#F2994A', fontSize: 'clamp(10px,1vw,11.5px)', fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'var(--font-body)',
            }}>About</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px,5.6vw,64px)',
            fontWeight: 800, color: 'white', lineHeight: 1.08,
            marginBottom: 'clamp(18px,2.6vw,24px)',
            animation: 'fadeInUp 0.7s 0.08s ease both',
          }}>
            Built on Trust,{' '}
            <span style={{
              background: 'linear-gradient(90deg, #F2994A, #FFB870)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Driven by Excellence</span>
          </h1>

          <p style={{
            color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(14px,1.6vw,17px)', lineHeight: 1.75,
            maxWidth: '540px', animation: 'fadeInUp 0.7s 0.16s ease both',
          }}>
            Get to know Realist Electro Controls Pvt Ltd — our story,
            our performance, and the people behind every project.
          </p>
        </div>
      </div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════
//  COMPANY SECTION
// ══════════════════════════════════════════════════════════════
function CompanySection({ content, loading }) {
  const [expanded, setExpanded] = useState(false)
  const paragraphs = content
    ? content.split(/\n\s*\n/).filter(p => p.trim())
    : []
  const yearsOfExcellence = new Date().getFullYear() - 2008

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

        {/* Asymmetric section marker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: 'clamp(36px,5vw,52px)' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#D97D2B', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>§ 01</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(242,153,74,0.25)', maxWidth: '60px' }} />
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#D97D2B', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>Who We Are</span>
        </div>

        {/* Split: heading + credential strip LEFT · body text RIGHT */}
        <div className="abt-company" style={{
          display: 'grid', gridTemplateColumns: '38% 1fr', gap: 'clamp(32px,5vw,72px)', alignItems: 'start',
        }}>

          {/* LEFT */}
          <div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(24px,3.6vw,42px)', fontWeight: 800,
              color: '#1A2332', lineHeight: 1.15, marginBottom: 'clamp(28px,4vw,36px)',
            }}>Our Company</h2>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '18px',
              padding: '18px 22px', borderLeft: '4px solid #F2994A',
              background: 'white', boxShadow: '0 2px 12px rgba(26,35,50,0.06)',
              marginBottom: '12px',
            }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,4.5vw,50px)',
                fontWeight: 800, color: '#F2994A', lineHeight: 1,
              }}>{yearsOfExcellence}</div>
              <div>
                <div style={{ color: '#1A2332', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Years of Excellence</div>
                <div style={{ color: '#5B7C99', fontSize: '11px', marginTop: '3px' }}>2008 – {new Date().getFullYear()}</div>
              </div>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '15px 22px', borderLeft: '4px solid #5B7C99',
              background: 'white', boxShadow: '0 2px 12px rgba(26,35,50,0.06)',
            }}>
              <span style={{ fontSize: '22px', lineHeight: 1 }}>🏆</span>
              <div>
                <div style={{ color: '#1A2332', fontSize: '13px', fontWeight: 700 }}>Super Grade Electrical Contractor</div>
                <div style={{ color: '#5B7C99', fontSize: '11px', marginTop: '2px' }}>Government of Karnataka</div>
              </div>
            </div>
          </div>

          {/* RIGHT — body text */}
          <div style={{ paddingTop: 'clamp(2px,0.6vw,8px)' }}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[100, 92, 96, 85, 70].map((w, i) => (
                  <div key={i} style={{
                    height: '15px', borderRadius: '4px', background: 'rgba(242,153,74,0.12)',
                    width: `${w}%`, animation: 'aboutShimmer 1.5s infinite'
                  }} />
                ))}
              </div>
            ) : paragraphs.length === 0 ? (
              <p style={{ color: '#9CA3AF', fontSize: '15px', fontStyle: 'italic' }}>
                Company information will appear here once added from the admin panel.
              </p>
            ) : (
              <>
                <div className={`expandable-text ${expanded ? 'expanded' : 'collapsed'}`}>
                  {paragraphs.map((para, i) => (
                    <p key={i} style={{
                      color: '#3F4A5A', fontSize: 'clamp(14px,1.5vw,16.5px)',
                      lineHeight: 1.9, marginBottom: '18px'
                    }}>{para}</p>
                  ))}
                </div>
                {paragraphs.length > 1 && (
                  <button
                    onClick={() => setExpanded(e => !e)}
                    style={{
                      marginTop: '8px', background: 'none', border: 'none',
                      cursor: 'pointer', color: '#D97D2B',
                      fontFamily: 'var(--font-body)',
                      fontSize: 'clamp(13px,1.3vw,14px)', fontWeight: 700,
                      letterSpacing: '0.05em', textTransform: 'uppercase',
                      display: 'flex', alignItems: 'center', gap: '6px', padding: 0
                    }}
                  >
                    {expanded ? 'Show Less' : 'Read More'}
                    <span style={{
                      fontSize: '15px', transition: 'transform 0.3s',
                      transform: expanded ? 'rotate(180deg)' : 'none',
                      display: 'inline-block'
                    }}>↓</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .abt-company { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════
//  PERFORMANCE SECTION — trend chart + stat cards
// ══════════════════════════════════════════════════════════════
function TrendChart({ data }) {
  // data: array of { financial_year, value }
  const width  = 700
  const height = 260
  const padL   = 60
  const padR   = 24
  const padT   = 30
  const padB   = 44

  const max = Math.max(...data.map(d => d.value), 1)
  const min = 0
  const innerW = width - padL - padR
  const innerH = height - padT - padB

  const points = data.map((d, i) => {
    const x = padL + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW)
    const y = padT + innerH - ((d.value - min) / (max - min)) * innerH
    return { x, y, ...d }
  })

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padT + innerH} L ${points[0].x} ${padT + innerH} Z`

  // Y-axis grid lines (4 steps)
  const steps = 4
  const gridLines = Array.from({ length: steps + 1 }, (_, i) => {
    const value = (max / steps) * i
    const y = padT + innerH - (value / max) * innerH
    return { y, value }
  })

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', minWidth: '460px', height: 'auto' }}>
        {/* Grid lines */}
        {gridLines.map((g, i) => (
          <g key={i}>
            <line x1={padL} y1={g.y} x2={width - padR} y2={g.y}
              stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
            <text x={padL - 10} y={g.y + 4} textAnchor="end"
              fontSize="11" fill="rgba(255,255,255,0.4)" fontFamily="Manrope, sans-serif">
              {compactINR(g.value)}
            </text>
          </g>
        ))}

        {/* Area fill */}
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F2994A" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#F2994A" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#areaGrad)" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="#F2994A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Points + labels */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="5" fill="#1A2332" stroke="#F2994A" strokeWidth="1.8" />
            {/* Value label above point */}
            <text x={p.x} y={p.y - 14} textAnchor="middle"
              fontSize="12" fontWeight="700" fill="#FFB870" fontFamily="Manrope, sans-serif">
              {compactINR(p.value)}
            </text>
            {/* X-axis label */}
            <text x={p.x} y={height - 14} textAnchor="middle"
              fontSize="12" fill="rgba(255,255,255,0.6)" fontFamily="Manrope, sans-serif" fontWeight="600">
              {p.financial_year}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

function PerformanceSection({ rows, loading }) {
  // Use last 5 if more than 5 entries (chronological order assumed from sort_order)
  const chartData = rows.length > 5 ? rows.slice(-5) : rows
  const dataPoints = chartData.map(r => ({
    financial_year: r.financial_year,
    value: toNumber(r.annual_turnover)
  }))

  const latest = rows.length > 0 ? rows[rows.length - 1] : null
  const previous = rows.length > 1 ? rows[rows.length - 2] : null

  let growthPct = null
  if (latest && previous) {
    const a = toNumber(latest.annual_turnover)
    const b = toNumber(previous.annual_turnover)
    if (b > 0) growthPct = ((a - b) / b) * 100
  }

  return (
    <section style={{
      padding: 'clamp(48px,7vw,90px) clamp(16px,3vw,24px)',
      background: 'linear-gradient(135deg, #1A2332 0%, #0d2a4a 100%)',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Decorative bg */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04,
        backgroundImage: 'radial-gradient(circle at 1px 1px, #F2994A 1px, transparent 0)',
        backgroundSize: '32px 32px', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(242,153,74,0.12) 0%, transparent 70%)',
        top: '-100px', left: '-80px', pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          marginBottom: 'clamp(32px,4vw,48px)', gap: '20px', flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#F2994A', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>§ 02</span>
              <div style={{ width: '40px', height: '1px', background: 'rgba(242,153,74,0.4)' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#F2994A', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>Growth Story</span>
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(24px,4vw,44px)', fontWeight: 800, color: 'white', lineHeight: 1.15,
            }}>Financial Performance</h2>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 'clamp(12px,1.3vw,15px)', maxWidth: '360px', lineHeight: 1.7 }}>
            A track record of consistent turnover growth, backed by disciplined project execution.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{
            height: '260px', borderRadius: '16px',
            background: 'rgba(255,255,255,0.04)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(242,153,74,0.1)'
          }}>
            <div style={{
              width: 36, height: 36, border: '3px solid rgba(242,153,74,0.2)',
              borderTopColor: '#F2994A', borderRadius: '50%',
              animation: 'aboutSpin 0.8s linear infinite'
            }} />
          </div>
        )}

        {/* No data */}
        {!loading && rows.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: '44px', marginBottom: '14px' }}>📊</div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px' }}>
              Financial performance data will appear here once added from the admin panel.
            </p>
          </div>
        )}

        {/* Content */}
        {!loading && rows.length > 0 && (
          <>
            {/* Stat cards row */}
            <div className="perf-stats-grid" style={{ marginBottom: 'clamp(24px,3vw,36px)' }}>
              <div style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(242,153,74,0.18)',
                borderRadius: '16px', padding: 'clamp(18px,2.5vw,26px)', textAlign: 'center'
              }}>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 600 }}>
                  Latest Turnover
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,3vw,34px)', fontWeight: 800, color: '#F2994A' }}>
                  {compactINR(toNumber(latest.annual_turnover))}
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginTop: '6px' }}>
                  FY {latest.financial_year}
                </div>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(242,153,74,0.18)',
                borderRadius: '16px', padding: 'clamp(18px,2.5vw,26px)', textAlign: 'center'
              }}>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 600 }}>
                  Year-on-Year Growth
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,3vw,34px)', fontWeight: 800,
                  color: growthPct === null ? 'rgba(255,255,255,0.4)' : growthPct >= 0 ? '#FFB870' : '#F87171'
                }}>
                  {growthPct === null ? '—' : `${growthPct >= 0 ? '+' : ''}${growthPct.toFixed(1)}%`}
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginTop: '6px' }}>
                  {previous ? `vs FY ${previous.financial_year}` : 'No prior data'}
                </div>
              </div>

              {/* <div style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(242,153,74,0.18)',
                borderRadius: '16px', padding: 'clamp(18px,2.5vw,26px)', textAlign: 'center'
              }}>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 600 }}>
                  Years of Record
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,3vw,34px)', fontWeight: 800, color: 'white' }}>
                  {rows.length}
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginTop: '6px' }}>
                  {rows[0].financial_year} – {rows[rows.length - 1].financial_year}
                </div>
              </div> */}
            </div>

            {/* Chart card */}
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(242,153,74,0.15)',
              borderRadius: '20px', padding: 'clamp(16px,3vw,32px)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(15px,1.8vw,19px)', fontWeight: 700, color: 'white', margin: 0 }}>
                  Annual Turnover Trend
                </h3>
                {rows.length > 5 && (
                  <span style={{
                    fontSize: '11px', color: '#F2994A', background: 'rgba(242,153,74,0.12)',
                    borderRadius: '100px', padding: '4px 12px', fontWeight: 600, letterSpacing: '0.04em'
                  }}>
                    Showing last 5 years
                  </span>
                )}
              </div>
              <TrendChart data={dataPoints} />
            </div>
          </>
        )}
      </div>

      <style>{`
        .perf-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(12px, 1.8vw, 18px);
        }
        @media (max-width: 640px) {
          .perf-stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════
//  PEOPLE SECTION
// ══════════════════════════════════════════════════════════════
function PersonCard({ person, index }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [expanded, setExpanded]   = useState(false)
  const CHAR_LIMIT = 140
  const isLong = (person.description || '').length > CHAR_LIMIT
  const displayText = expanded || !isLong
    ? person.description
    : person.description.slice(0, CHAR_LIMIT).trimEnd() + '…'

  return (
    <div style={{
      borderRadius: '18px', overflow: 'hidden', background: 'white',
      boxShadow: '0 4px 20px rgba(26,35,50,0.07)',
      border: '1px solid rgba(26,35,50,0.06)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      animation: `aboutCardIn 0.5s ${index * 0.08}s ease both`
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px)'
        e.currentTarget.style.boxShadow = '0 14px 40px rgba(26,35,50,0.12)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(26,35,50,0.07)'
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 'clamp(200px,24vw,260px)', overflow: 'hidden', background: '#E5E7EB' }}>
        {!imgLoaded && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg,#E5E7EB 25%,#F3F4F6 50%,#E5E7EB 75%)',
            backgroundSize: '200% 100%', animation: 'aboutShimmer 1.5s infinite'
          }} />
        )}
        <img
          src={person.image_url} alt={person.name}
          onLoad={() => setImgLoaded(true)}
          onError={e => {
            setImgLoaded(true)
            e.target.src = `https://placehold.co/400x400/0B1F3A/14B8A6?text=${encodeURIComponent(person.name)}`
          }}
          style={{
            width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top',
            opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.4s ease'
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(26,35,50,0.85) 0%, rgba(26,35,50,0.1) 60%, transparent 100%)'
        }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(14px,2vw,20px)' }}>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(16px,2vw,20px)', fontWeight: 700, color: 'white',
            lineHeight: 1.25, marginBottom: '4px',
            textShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}>{person.name}</h3>
          {person.designation && (
            <p style={{
              color: '#FFB870', fontSize: 'clamp(11px,1.2vw,13px)',
              fontWeight: 600, letterSpacing: '0.05em', margin: 0
            }}>{person.designation}</p>
          )}
        </div>
        <div style={{
          position: 'absolute', top: 0, left: 0,
          width: '4px', height: '100%',
          background: 'linear-gradient(180deg, #F2994A, #D97D2B)'
        }} />
        <span style={{
          position: 'absolute', top: '14px', left: '18px',
          fontFamily: 'var(--font-display)', fontSize: 'clamp(11px,1.2vw,13px)',
          fontWeight: 800, color: '#FFB870', letterSpacing: '0.1em',
        }}>{String(index + 1).padStart(2, '0')}</span>
      </div>

      {/* Description */}
      {person.description && (
        <div style={{ padding: 'clamp(16px,2vw,22px)' }}>
          <p style={{
            color: '#6B7280', fontSize: 'clamp(12px,1.3vw,14px)',
            lineHeight: 1.75, margin: 0
          }}>{displayText}</p>
          {isLong && (
            <button
              onClick={() => setExpanded(e => !e)}
              style={{
                marginTop: '10px', background: 'none', border: 'none',
                cursor: 'pointer', color: '#F2994A',
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(11px,1.1vw,12px)', fontWeight: 700, padding: 0
              }}
            >{expanded ? 'Show Less ↑' : 'Read More ↓'}</button>
          )}
        </div>
      )}
    </div>
  )
}

function PeopleSection({ people, loading }) {
  return (
    <section style={{
      padding: 'clamp(48px,7vw,90px) clamp(16px,3vw,24px)',
      background: '#FAF7F2'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          marginBottom: 'clamp(36px,5vw,56px)', gap: '20px', flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#D97D2B', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>§ 03</span>
              <div style={{ width: '40px', height: '1px', background: 'rgba(242,153,74,0.4)' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#D97D2B', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>Meet The Team</span>
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(24px,4vw,44px)', fontWeight: 800,
              color: '#1A2332', lineHeight: 1.15,
            }}>The People Behind SMEE</h2>
          </div>
          <p style={{ color: '#6B7280', fontSize: 'clamp(13px,1.3vw,15px)', maxWidth: '360px', lineHeight: 1.7 }}>
            Experienced technocrats and skilled professionals driving engineering excellence.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="people-grid">
            {[1,2,3,4].map(i => (
              <div key={i} style={{ borderRadius: '18px', overflow: 'hidden', background: 'white', boxShadow: '0 4px 20px rgba(26,35,50,0.07)' }}>
                <div style={{ height: '240px', background: 'linear-gradient(90deg,#E5E7EB 25%,#F3F4F6 50%,#E5E7EB 75%)', backgroundSize: '200% 100%', animation: 'aboutShimmer 1.5s infinite' }} />
                <div style={{ padding: '20px' }}>
                  <div style={{ height: '14px', background: '#F3F4F6', borderRadius: '6px', marginBottom: '8px' }} />
                  <div style={{ height: '14px', background: '#F3F4F6', borderRadius: '6px', width: '70%' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && people.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: '52px', marginBottom: '16px' }}>👥</div>
            <h3 style={{ fontFamily: 'var(--font-display)', color: '#1A2332', marginBottom: '10px' }}>
              Team Profiles Coming Soon
            </h3>
            <p style={{ color: '#9CA3AF', fontSize: '15px' }}>
              Team member details will be listed here once added from the admin panel.
            </p>
          </div>
        )}

        {/* Grid */}
        {!loading && people.length > 0 && (
          <div className="people-grid">
            {people.map((person, i) => (
              <PersonCard key={person.id} person={person} index={i} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .people-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(16px, 2.2vw, 24px);
        }
        @media (max-width: 1000px) {
          .people-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .people-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════
//  PAGE ROOT
// ══════════════════════════════════════════════════════════════
export default function AboutPage() {
  const [companyContent, setCompanyContent] = useState('')
  const [companyLoad,    setCompanyLoad]    = useState(true)

  const [perfRows, setPerfRows] = useState([])
  const [perfLoad, setPerfLoad] = useState(true)

  const [people,    setPeople]    = useState([])
  const [peopleLoad, setPeopleLoad] = useState(true)

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [])

  useEffect(() => {
    axios.get(`${API_URL}/api/admin/about-company`)
      .then(({ data }) => { if (data.success && data.data) setCompanyContent(data.data.content) })
      .catch(() => {})
      .finally(() => setCompanyLoad(false))

    axios.get(`${API_URL}/api/admin/business-performance`)
      .then(({ data }) => { if (data.success) setPerfRows(data.rows || []) })
      .catch(() => {})
      .finally(() => setPerfLoad(false))

    axios.get(`${API_URL}/api/admin/about-people/public`)
      .then(({ data }) => { if (data.success) setPeople(data.people || []) })
      .catch(() => {})
      .finally(() => setPeopleLoad(false))
  }, [])

  return (
    <>
      <PageHero />
      <CompanySection content={companyContent} loading={companyLoad} />
      <PerformanceSection rows={perfRows} loading={perfLoad} />
      <PeopleSection people={people} loading={peopleLoad} />

      <style>{`
        @keyframes aboutShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes aboutSpin { to { transform: rotate(360deg); } }
        @keyframes aboutCardIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}