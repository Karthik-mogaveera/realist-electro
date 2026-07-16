// src/pages/ContactPage.jsx
// ─────────────────────────────────────────────────────────────
// Public Contact page — reached from "Get Quote" button.
// Form fields: Name, Email, Phone, Company Name, Message.
// Security: X-Requested-With CSRF header, client-side validation.
// On success: shows thank-you card, resets form.
// ─────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// ── Individual form field ─────────────────────────────────────
function Field({ label, required, error, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
      <label style={{
        fontSize: '13px', fontWeight: 700,
        color: error ? '#EF4444' : '#3F4A5A',
        letterSpacing: '0.02em'
      }}>
        {label}{required && <span style={{ color: '#F2994A', marginLeft: '3px' }}>*</span>}
      </label>
      {children}
      {error && (
        <span style={{
          fontSize: '12px', color: '#EF4444',
          display: 'flex', alignItems: 'center', gap: '5px'
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </span>
      )}
    </div>
  )
}

// ── Input styles ──────────────────────────────────────────────
const baseInput = {
  padding: '13px 16px',
  border: '1.5px solid rgba(26,35,50,0.15)',
  borderRadius: '10px',
  fontFamily: 'var(--font-body)',
  fontSize: '15px',
  color: '#3F4A5A',
  background: 'white',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}

function TextInput({ value, onChange, placeholder, type = 'text', hasError }) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        ...baseInput,
        borderColor: hasError ? '#EF4444'
          : focused ? '#F2994A'
          : 'rgba(26,35,50,0.15)',
        boxShadow: hasError ? '0 0 0 3px rgba(239,68,68,0.08)'
          : focused ? '0 0 0 3px rgba(242,153,74,0.1)'
          : 'none',
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  )
}

function TextArea({ value, onChange, placeholder, hasError }) {
  const [focused, setFocused] = useState(false)
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={6}
      style={{
        ...baseInput,
        resize: 'vertical',
        minHeight: '140px',
        lineHeight: '1.7',
        borderColor: hasError ? '#EF4444'
          : focused ? '#F2994A'
          : 'rgba(26,35,50,0.15)',
        boxShadow: hasError ? '0 0 0 3px rgba(239,68,68,0.08)'
          : focused ? '0 0 0 3px rgba(242,153,74,0.1)'
          : 'none',
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  )
}

// ── Page hero ─────────────────────────────────────────────────
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
//         position: 'absolute', right: 'clamp(-20px,-2vw,10px)', bottom: '-8%',
//         fontFamily: 'var(--font-display)', fontWeight: 800,
//         fontSize: 'clamp(80px,15vw,220px)', color: 'rgba(255,255,255,0.035)',
//         lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.03em',
//       }}>CONTACT</div>

//       <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
//         <div style={{ maxWidth: '620px' }}>
//           <div style={{
//             display: 'inline-flex', alignItems: 'center', gap: '10px',
//             padding: 'clamp(7px,1vw,9px) clamp(14px,2vw,18px)', borderRadius: '999px',
//             background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(242,153,74,0.4)',
//             marginBottom: 'clamp(22px,3vw,30px)', animation: 'fadeInUp 0.6s ease both',
//           }}>
//             <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F2994A', flexShrink: 0 }} />
//             <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(10px,1vw,11.5px)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>Home</span>
//             <span style={{ color: '#F2994A', fontSize: '11px' }}>/</span>
//             <span style={{ color: '#F2994A', fontSize: 'clamp(10px,1vw,11.5px)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>Contact</span>
//           </div>

//           <h1 style={{
//             fontFamily: 'var(--font-display)',
//             fontSize: 'clamp(30px,5.2vw,58px)',
//             fontWeight: 800, color: 'white', lineHeight: 1.1,
//             marginBottom: 'clamp(16px,2.4vw,22px)',
//             animation: 'fadeInUp 0.7s 0.08s ease both',
//           }}>
//             Let's Talk About{' '}
//             <span style={{
//               background: 'linear-gradient(90deg, #F2994A, #FFB870)',
//               WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
//             }}>Your Next Project</span>
//           </h1>

//           <p style={{
//             color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(14px,1.6vw,17px)', lineHeight: 1.75,
//             maxWidth: '480px', animation: 'fadeInUp 0.7s 0.16s ease both',
//           }}>
//             Tell us about your requirement and our team will reach out with a tailored solution.
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
        backgroundImage: `url('/images/tower.jpg')`, // ← swap in your image path/URL
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
        position: 'absolute', right: 'clamp(-20px,-2vw,10px)', bottom: '-8%',
        fontFamily: 'var(--font-display)', fontWeight: 800,
        fontSize: 'clamp(80px,15vw,220px)', color: 'rgba(255,255,255,0.035)',
        lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.03em',
      }}>CONTACT</div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ maxWidth: '620px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: 'clamp(7px,1vw,9px) clamp(14px,2vw,18px)', borderRadius: '999px',
            background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(242,153,74,0.4)',
            marginBottom: 'clamp(22px,3vw,30px)', animation: 'fadeInUp 0.6s ease both',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F2994A', flexShrink: 0 }} />
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(10px,1vw,11.5px)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>Home</span>
            <span style={{ color: '#F2994A', fontSize: '11px' }}>/</span>
            <span style={{ color: '#F2994A', fontSize: 'clamp(10px,1vw,11.5px)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>Contact</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(30px,5.2vw,58px)',
            fontWeight: 800, color: 'white', lineHeight: 1.1,
            marginBottom: 'clamp(16px,2.4vw,22px)',
            animation: 'fadeInUp 0.7s 0.08s ease both',
          }}>
            Let's Talk About{' '}
            <span style={{
              background: 'linear-gradient(90deg, #F2994A, #FFB870)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Your Next Project</span>
          </h1>

          <p style={{
            color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(14px,1.6vw,17px)', lineHeight: 1.75,
            maxWidth: '480px', animation: 'fadeInUp 0.7s 0.16s ease both',
          }}>
            Tell us about your requirement and our team will reach out with a tailored solution.
          </p>
        </div>
      </div>


    </section>
  )
}

// ── Success card shown after submission ───────────────────────
function SuccessCard({ onReset }) {
  return (
    <div style={{
      textAlign: 'center', padding: 'clamp(40px,6vw,64px) 32px',
      animation: 'cntFadeIn 0.5s ease'
    }}>
      <div style={{
        width: '80px', height: '80px', borderRadius: '50%',
        background: 'linear-gradient(135deg,#F2994A,#D97D2B)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 24px',
        boxShadow: '0 8px 32px rgba(242,153,74,0.35)',
        animation: 'cntPopIn 0.4s cubic-bezier(0.34,1.56,0.64,1)'
      }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
          stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(22px,3vw,30px)', fontWeight: 700,
        color: '#1A2332', marginBottom: '12px'
      }}>Enquiry Sent Successfully!</h2>
      <p style={{
        color: '#6B7280', fontSize: 'clamp(14px,1.5vw,16px)',
        lineHeight: 1.7, maxWidth: '420px', margin: '0 auto 28px'
      }}>
        Thank you for reaching out. We've sent a confirmation to your email
        and our team will contact you within <strong>1–2 business days</strong>.
      </p>
      <button onClick={onReset} style={{
        padding: '12px 28px', borderRadius: '10px', border: 'none',
        background: 'linear-gradient(135deg,#F2994A,#D97D2B)',
        color: 'white', fontFamily: 'var(--font-body)',
        fontSize: '14px', fontWeight: 600, cursor: 'pointer',
        boxShadow: '0 4px 14px rgba(242,153,74,0.3)', transition: 'all 0.2s'
      }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
      >Send Another Enquiry</button>
    </div>
  )
}

// ── Contact info card ─────────────────────────────────────────
function ContactInfoCard() {
  const [info, setInfo]       = useState(null)
  const [loading, setLoading] = useState(true)
 
  useEffect(() => {
    axios.get(`${API_URL}/api/admin/settings/information/public`)
      .then(({ data }) => { if (data.success && data.data) setInfo(data.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])
 
  // Fallback values used only while loading / if nothing is set in the DB yet
  const FALLBACK = {
    address: '12, 3rd Cross, 1st Main, RMV 2nd Stage, Nageshettyhalli, Bengaluru – 560094',
    phone:   '+91 80 XXXX XXXX',
    email:   'info@smeeindia.com',
    map_url: null,
  }
  const data = info || FALLBACK
 
  const items = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="#F2994A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      ),
      label: 'Address',
      value: data.address || FALLBACK.address,
      // Clicking address opens the map URL from the DB (if set)
      href: data.map_url || null,
      target: '_blank',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="#F2994A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.9 12.13 19.79 19.79 0 0 1 1.91 3.54 2 2 0 0 1 3.89 1.35h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9a16 16 0 0 0 6.91 6.91l1.01-1.01a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2.02z"/>
        </svg>
      ),
      label: 'Phone',
      value: data.phone || FALLBACK.phone,
      // Clicking phone opens the device's phone/dialer app
      href: data.phone ? `tel:${data.phone.replace(/\s+/g, '')}` : null,
      target: '_self',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="#F2994A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      ),
      label: 'Email',
      value: data.email || FALLBACK.email,
      // Clicking email opens the default mail client
      href: data.email ? `mailto:${data.email}` : null,
      target: '_self',
    },
  ]
 
  return (
    <div style={{
      background: 'linear-gradient(135deg, #1A2332 0%, #0d2a4a 100%)',
      borderRadius: '20px', padding: 'clamp(24px,3.5vw,40px)',
      height: '100%', boxSizing: 'border-box', position: 'relative', overflow: 'hidden'
    }}>
      {/* Decorative glow */}
      <div style={{
        position: 'absolute', width: '280px', height: '280px',
        background: 'radial-gradient(circle, rgba(242,153,74,0.12) 0%, transparent 70%)',
        bottom: '-80px', right: '-60px', pointerEvents: 'none'
      }} />
 
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(18px,2.2vw,24px)', fontWeight: 700,
          color: 'white', marginBottom: '8px'
        }}>Get In Touch</h3>
        <p style={{
          color: 'rgba(255,255,255,0.55)',
          fontSize: 'clamp(13px,1.4vw,15px)', lineHeight: 1.7, marginBottom: '32px'
        }}>
          We're ready to take on your next engineering challenge.
        </p>
 
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                  background: 'rgba(255,255,255,0.06)', animation: 'shimmer 1.5s infinite',
                }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '4px' }}>
                  <div style={{ height: '10px', width: '40%', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', animation: 'shimmer 1.5s infinite' }} />
                  <div style={{ height: '13px', width: '85%', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', animation: 'shimmer 1.5s infinite' }} />
                </div>
              </div>
            ))
          ) : items.map(({ icon, label, value, href, target }) => {
            const row = (
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                  background: 'rgba(242,153,74,0.15)',
                  border: '1px solid rgba(242,153,74,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>{icon}</div>
                <div>
                  <div style={{
                    fontSize: '11px', fontWeight: 700, color: '#F2994A',
                    letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px'
                  }}>{label}</div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'clamp(13px,1.3vw,14px)', lineHeight: 1.6 }}>
                    {value}
                  </div>
                </div>
              </div>
            )
 
            if (!href) return <div key={label}>{row}</div>
 
            return (
              <a
                key={label}
                href={href}
                target={target}
                rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                style={{ textDecoration: 'none', display: 'block', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.8' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
              >
                {row}
              </a>
            )
          })}
        </div>
 
        {/* Working hours */}
        <div style={{
 
          marginTop: '32px', paddingTop: '24px',
          borderTop: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#F2994A', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Working Hours
          </div>
          {[
            ['Monday – Saturday', '9:00 AM – 6:00 PM'],
            ['Sunday', 'Closed'],
          ].map(([day, time]) => (
            <div key={day} style={{
              display: 'flex', justifyContent: 'space-between',
              marginBottom: '6px'
            }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>{day}</span>
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', fontWeight: 600 }}>{time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
//  CONTACT FORM
// ══════════════════════════════════════════════════════════════
function ContactForm({ onSuccess }) {
  const [fields, setFields] = useState({
    name: '', email: '', phone: '', company_name: '', message: ''
  })
  const [errors,     setErrors]     = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [serverErr,  setServerErr]  = useState('')

  const set = (key) => (e) => {
    setFields(f => ({ ...f, [key]: e.target.value }))
    if (errors[key]) setErrors(er => ({ ...er, [key]: '' }))
    setServerErr('')
  }

  const validate = () => {
    const e = {}
    if (!fields.name.trim() || fields.name.trim().length < 2)
      e.name = 'Name must be at least 2 characters.'
    if (!fields.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
      e.email = 'Please enter a valid email address.'
    if (fields.phone && !/^[+\d\s\-().]{7,20}$/.test(fields.phone))
      e.phone = 'Please enter a valid phone number.'
    if (!fields.message.trim() || fields.message.trim().length < 10)
      e.message = 'Message must be at least 10 characters.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerErr('')
    if (!validate()) return

    setSubmitting(true)
    try {
      await axios.post(`${API_URL}/api/contact`, fields, {
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',  // CSRF header
        }
      })
      onSuccess()
    } catch (err) {
      const msg = err.response?.data?.message
      if (err.response?.status === 429) {
        setServerErr('Too many submissions. Please wait 15 minutes and try again.')
      } else if (err.response?.status === 422 && err.response?.data?.errors) {
        // Map server validation errors back to fields
        const serverErrors = {}
        err.response.data.errors.forEach(m => {
          if (m.toLowerCase().includes('name'))    serverErrors.name    = m
          if (m.toLowerCase().includes('email'))   serverErrors.email   = m
          if (m.toLowerCase().includes('phone'))   serverErrors.phone   = m
          if (m.toLowerCase().includes('message')) serverErrors.message = m
        })
        setErrors(serverErrors)
      } else {
        setServerErr(msg || 'Something went wrong. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const charCount = fields.message.length

  return (
    <form onSubmit={handleSubmit} noValidate>

      {/* Server error banner */}
      {serverErr && (
        <div style={{
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: '10px', padding: '13px 16px', marginBottom: '24px',
          display: 'flex', alignItems: 'center', gap: '10px',
          color: '#EF4444', fontSize: '14px', fontWeight: 500
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {serverErr}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Name + Email row */}
        <div className="cnt-row-2">
          <Field label="Full Name" required error={errors.name}>
            <TextInput
              value={fields.name}
              onChange={set('name')}
              placeholder="e.g. Ravi Kumar"
              hasError={!!errors.name}
            />
          </Field>
          <Field label="Email Address" required error={errors.email}>
            <TextInput
              type="email"
              value={fields.email}
              onChange={set('email')}
              placeholder="you@company.com"
              hasError={!!errors.email}
            />
          </Field>
        </div>

        {/* Phone + Company row */}
        <div className="cnt-row-2">
          <Field label="Phone Number" error={errors.phone}>
            <TextInput
              type="tel"
              value={fields.phone}
              onChange={set('phone')}
              placeholder="+91 98765 43210"
              hasError={!!errors.phone}
            />
          </Field>
          <Field label="Company Name" error={errors.company_name}>
            <TextInput
              value={fields.company_name}
              onChange={set('company_name')}
              placeholder="Your organisation (optional)"
              hasError={!!errors.company_name}
            />
          </Field>
        </div>

        {/* Message */}
        <Field label="Message" required error={errors.message}>
          <div style={{ position: 'relative' }}>
            <TextArea
              value={fields.message}
              onChange={set('message')}
              placeholder="Describe your project requirement, scope of work, or any queries you have..."
              hasError={!!errors.message}
            />
            <div style={{
              position: 'absolute', bottom: '10px', right: '14px',
              fontSize: '11px', color: charCount > 4800 ? '#EF4444' : '#9CA3AF',
              pointerEvents: 'none',
              background: 'rgba(255,255,255,0.85)', padding: '2px 7px', borderRadius: '100px'
            }}>
              {charCount} / 5000
            </div>
          </div>
        </Field>

        {/* Disclaimer */}
        <p style={{ color: '#9CA3AF', fontSize: '12px', lineHeight: 1.6, margin: 0 }}>
          By submitting this form you agree that the information provided may be used to respond
          to your enquiry. We do not share your data with third parties.
        </p>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: 'clamp(13px,1.8vw,16px) clamp(28px,3vw,40px)',
            background: submitting
              ? 'rgba(242,153,74,0.5)'
              : 'linear-gradient(135deg,#F2994A,#D97D2B)',
            border: 'none', borderRadius: '12px', cursor: submitting ? 'not-allowed' : 'pointer',
            color: 'white', fontFamily: 'var(--font-body)',
            fontSize: 'clamp(14px,1.4vw,16px)', fontWeight: 700,
            letterSpacing: '0.03em',
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            alignSelf: 'flex-start',
            boxShadow: submitting ? 'none' : '0 6px 22px rgba(242,153,74,0.35)',
            transition: 'all 0.25s'
          }}
          onMouseEnter={e => { if (!submitting) e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          {submitting ? (
            <>
              <span style={{
                width: '18px', height: '18px', display: 'inline-block',
                border: '2.5px solid rgba(255,255,255,0.3)',
                borderTopColor: 'white', borderRadius: '50%',
                animation: 'cntSpin 0.8s linear infinite'
              }} />
              Sending…
            </>
          ) : (
            <>
              Send Enquiry
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </>
          )}
        </button>
      </div>

      <style>{`
        .cnt-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 560px) {
          .cnt-row-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </form>
  )
}

// ══════════════════════════════════════════════════════════════
//  PAGE ROOT
// ══════════════════════════════════════════════════════════════
export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <>
      <PageHero />

      <section id="contact-form" style={{
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
          <div style={{
            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
            marginBottom: 'clamp(36px,5vw,56px)', gap: '20px', flexWrap: 'wrap',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#D97D2B', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>§ 01</span>
                <div style={{ width: '40px', height: '1px', background: 'rgba(242,153,74,0.4)' }} />
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#D97D2B', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>Get In Touch</span>
              </div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(24px,4vw,44px)', fontWeight: 800, color: '#1A2332', lineHeight: 1.15,
              }}>Send Us Your Enquiry</h2>
            </div>
            <p style={{ color: '#6B7280', fontSize: 'clamp(13px,1.3vw,15px)', maxWidth: '360px', lineHeight: 1.7 }}>
              Fill in the form below and we'll get back to you with a tailored proposal.
            </p>
          </div>

          <div className="cnt-page-grid">
            {/* Left: form or success (primary focus) */}
            <div style={{
              background: 'white', borderRadius: '20px',
              padding: 'clamp(24px,3.5vw,44px)',
              boxShadow: '0 8px 40px rgba(26,35,50,0.08)',
              border: '1px solid rgba(26,35,50,0.06)'
            }}>
              {submitted ? (
                <SuccessCard onReset={() => setSubmitted(false)} />
              ) : (
                <ContactForm onSuccess={() => setSubmitted(true)} />
              )}
            </div>

            {/* Right: contact info */}
            <ContactInfoCard />
          </div>
        </div>

        <style>{`
          .cnt-page-grid {
            display: grid;
            grid-template-columns: 1.6fr 1fr;
            gap: clamp(20px, 3vw, 36px);
            align-items: start;
          }
          @media (max-width: 820px) {
            .cnt-page-grid { grid-template-columns: 1fr !important; }
          }
          @keyframes cntFadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes cntPopIn {
            from { opacity: 0; transform: scale(0.7); }
            to   { opacity: 1; transform: scale(1); }
          }
          @keyframes cntSpin { to { transform: rotate(360deg); } }
        `}</style>
      </section>
    </>
  )
}