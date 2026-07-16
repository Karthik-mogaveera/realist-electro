// src/pages/ProjectsPage.jsx
// ─────────────────────────────────────────────────────────────
// Public Projects page — reached from header nav "Projects".
// Displays project cards (image + name). Clicking "Know More"
// opens a popup/modal showing that project's works (image + name).
// ─────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// ── Skeleton card ─────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{
      borderRadius: '18px', overflow: 'hidden', background: 'white',
      boxShadow: '0 4px 20px rgba(26,35,50,0.07)',
      border: '1px solid rgba(26,35,50,0.06)'
    }}>
      <div style={{
        height: '220px',
        background: 'linear-gradient(90deg,#E5E7EB 25%,#F3F4F6 50%,#E5E7EB 75%)',
        backgroundSize: '200% 100%',
        animation: 'prjPageShimmer 1.5s infinite'
      }} />
      <div style={{ padding: '22px' }}>
        <div style={{ height: '18px', background: '#E5E7EB', borderRadius: '6px', width: '70%', marginBottom: '16px' }} />
        <div style={{ height: '38px', background: '#F3F4F6', borderRadius: '8px', width: '120px' }} />
      </div>
    </div>
  )
}

// ── PROJECT CARD ───────────────────────────────────────────────
function ProjectCard({ project, index, onKnowMore }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const workCount = project.works?.length || 0

  return (
    <div
      style={{
        borderRadius: '18px', overflow: 'hidden', background: 'white',
        boxShadow: '0 4px 20px rgba(26,35,50,0.07)',
        border: '1px solid rgba(26,35,50,0.06)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        animation: `prjCardIn 0.5s ${index * 0.07}s ease both`
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
      <div style={{ position: 'relative', height: 'clamp(180px,22vw,240px)', overflow: 'hidden', background: '#E5E7EB' }}>
        {!imgLoaded && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg,#E5E7EB 25%,#F3F4F6 50%,#E5E7EB 75%)',
            backgroundSize: '200% 100%', animation: 'prjPageShimmer 1.5s infinite'
          }} />
        )}
        <img
          src={project.image_url} alt={project.name}
          onLoad={() => setImgLoaded(true)}
          onError={e => {
            setImgLoaded(true)
            e.target.src = `https://placehold.co/600x400/0B1F3A/14B8A6?text=${encodeURIComponent(project.name)}`
          }}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.4s ease'
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(26,35,50,0.55) 0%, transparent 50%)'
        }} />
        {/* Work count badge */}
        {workCount > 0 && (
          <div style={{
            position: 'absolute', top: '14px', right: '14px',
            background: 'rgba(242,153,74,0.92)', color: 'white',
            fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em',
            borderRadius: '100px', padding: '5px 14px',
            backdropFilter: 'blur(4px)', boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
          }}>
            {workCount} Work{workCount !== 1 ? 's' : ''}
          </div>
        )}
        {/* Teal accent bar */}
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

      {/* Body */}
      <div style={{ padding: 'clamp(18px,2.5vw,24px)' }}>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(15px,1.8vw,19px)',
          fontWeight: 700, color: '#1A2332',
          lineHeight: 1.35, marginBottom: 'clamp(14px,1.8vw,20px)',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
        }}>{project.name}</h3>

        <button
          onClick={() => onKnowMore(project)}
          className="btn-primary"
          style={{
            padding: 'clamp(9px,1.2vw,11px) clamp(18px,2vw,24px)',
            borderRadius: '8px', border: 'none', cursor: 'pointer',
            fontSize: 'clamp(12px,1.2vw,13px)',
            display: 'inline-flex', alignItems: 'center', gap: '7px'
          }}
        >
          Know More
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

// ── WORKS POPUP / MODAL ────────────────────────────────────────
function WorksModal({ project, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [])

  const works = project.works || []

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(6,15,29,0.72)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(16px,3vw,32px)',
        animation: 'prjOverlayIn 0.25s ease'
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#FAF7F2', borderRadius: '20px',
          width: '100%', maxWidth: '920px',
          maxHeight: '85vh', overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 32px 90px rgba(0,0,0,0.35)',
          animation: 'prjModalIn 0.35s cubic-bezier(0.34,1.2,0.64,1)'
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1A2332 0%, #0d2a4a 100%)',
          padding: 'clamp(20px,3vw,28px) clamp(20px,3vw,32px)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          gap: '16px', flexShrink: 0
        }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', minWidth: 0 }}>
            <div style={{
              width: 'clamp(48px,6vw,64px)', height: 'clamp(48px,6vw,64px)',
              borderRadius: '12px', overflow: 'hidden', flexShrink: 0,
              border: '2px solid rgba(242,153,74,0.4)'
            }}>
              <img
                src={project.image_url} alt={project.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => { e.target.src = `https://placehold.co/64x64/0B1F3A/14B8A6?text=${encodeURIComponent(project.name[0] || 'P')}` }}
              />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em',
                color: '#F2994A', textTransform: 'uppercase', marginBottom: '4px'
              }}>Project Works</div>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(16px,2.4vw,24px)', fontWeight: 700, color: 'white',
                lineHeight: 1.3, margin: 0,
                overflow: 'hidden', textOverflow: 'ellipsis',
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
              }}>{project.name}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '10px', width: '38px', height: '38px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '18px', cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          >✕</button>
        </div>

        {/* Body — scrollable works grid */}
        <div style={{ padding: 'clamp(18px,3vw,32px)', overflowY: 'auto', flex: 1 }}>
          {works.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <div style={{ fontSize: '44px', marginBottom: '12px' }}>🛠️</div>
              <p style={{ color: '#9CA3AF', fontSize: '15px' }}>
                Work details for this project will be added soon.
              </p>
            </div>
          ) : (
            <div className="prj-works-grid">
              {works.map((w, i) => (
                <div key={w.id || i} style={{
                  borderRadius: '14px', overflow: 'hidden', background: 'white',
                  border: '1px solid rgba(26,35,50,0.06)',
                  boxShadow: '0 2px 12px rgba(26,35,50,0.05)',
                  animation: `prjCardIn 0.4s ${i * 0.05}s ease both`
                }}>
                  <div style={{ height: 'clamp(120px,16vw,160px)', overflow: 'hidden', position: 'relative' }}>
                    <img
                      src={w.image_url} alt={w.work_name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { e.target.src = `https://placehold.co/300x200/E5E7EB/9CA3AF?text=${encodeURIComponent(w.work_name)}` }}
                    />
                  </div>
                  <div style={{ padding: '12px 14px' }}>
                    <p style={{
                      margin: 0, fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(13px,1.4vw,15px)', fontWeight: 700,
                      color: '#1A2332', lineHeight: 1.4
                    }}>{w.work_name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .prj-works-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(12px, 1.8vw, 18px);
        }
        @media (max-width: 700px) {
          .prj-works-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 420px) {
          .prj-works-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

// ── PAGE HERO BANNER ─────────────────────────────────────────
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
//       }}>PROJECTS</div>

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
//             <span style={{ color: '#F2994A', fontSize: 'clamp(10px,1vw,11.5px)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>Projects</span>
//           </div>

//           <h1 style={{
//             fontFamily: 'var(--font-display)',
//             fontSize: 'clamp(32px,5.6vw,64px)',
//             fontWeight: 800, color: 'white', lineHeight: 1.08,
//             marginBottom: 'clamp(18px,2.6vw,24px)',
//             animation: 'fadeInUp 0.7s 0.08s ease both',
//           }}>
//             Projects That{' '}
//             <span style={{
//               background: 'linear-gradient(90deg, #F2994A, #FFB870)',
//               WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
//             }}>Power the Nation</span>
//           </h1>

//           <p style={{
//             color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(14px,1.6vw,17px)', lineHeight: 1.75,
//             maxWidth: '540px', animation: 'fadeInUp 0.7s 0.16s ease both',
//           }}>
//             A showcase of our completed and ongoing EPC projects across
//             substations, transmission lines, solar plants and irrigation systems.
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
        backgroundImage: `url('/images/pjt.jpg')`, // ← swap in your image path/URL
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

      {/* <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 44px, rgba(242,153,74,0.045) 44px, rgba(242,153,74,0.045) 45px)`,
      }} /> */}
      <div style={{
        position: 'absolute', right: 'clamp(-20px,-2vw,10px)', bottom: '-6%',
        fontFamily: 'var(--font-display)', fontWeight: 800,
        fontSize: 'clamp(80px,15vw,220px)', color: 'rgba(255,255,255,0.035)',
        lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.03em',
      }}>PROJECTS</div>

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
            <span style={{ color: '#F2994A', fontSize: 'clamp(10px,1vw,11.5px)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>Projects</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px,5.6vw,64px)',
            fontWeight: 800, color: 'white', lineHeight: 1.08,
            marginBottom: 'clamp(18px,2.6vw,24px)',
            animation: 'fadeInUp 0.7s 0.08s ease both',
          }}>
            Projects That{' '}
            <span style={{
              background: 'linear-gradient(90deg, #F2994A, #FFB870)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Power the Nation</span>
          </h1>

          <p style={{
            color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(14px,1.6vw,17px)', lineHeight: 1.75,
            maxWidth: '540px', animation: 'fadeInUp 0.7s 0.16s ease both',
          }}>
            A showcase of our completed and ongoing EPC projects across
            substations, transmission lines, solar plants and irrigation systems.
          </p>
        </div>
      </div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════
//  PAGE ROOT
// ══════════════════════════════════════════════════════════════
export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [activeProject, setActiveProject] = useState(null)

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [])

  useEffect(() => {
    axios.get(`${API_URL}/api/admin/projects/public`)
      .then(({ data }) => { if (data.success) setProjects(data.projects || []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <PageHero />

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
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#D97D2B', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>Our Work</span>
              </div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(24px,4vw,44px)', fontWeight: 800, color: '#1A2332', lineHeight: 1.15,
              }}>Completed & Ongoing Projects</h2>
            </div>
            <p style={{ color: '#6B7280', fontSize: 'clamp(13px,1.3vw,15px)', maxWidth: '380px', lineHeight: 1.7 }}>
              Explore each project and click <b>Know More</b> to see the detailed
              breakdown of works carried out.
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="prj-page-grid">
              {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Empty */}
          {!loading && projects.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: '52px', marginBottom: '16px' }}>🏗️</div>
              <h3 style={{ fontFamily: 'var(--font-display)', color: '#1A2332', marginBottom: '10px' }}>
                Projects Coming Soon
              </h3>
              <p style={{ color: '#9CA3AF', fontSize: '15px' }}>
                Our project portfolio will be listed here once added from the admin panel.
              </p>
            </div>
          )}

          {/* Grid */}
          {!loading && projects.length > 0 && (
            <div className="prj-page-grid">
              {projects.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={i}
                  onKnowMore={setActiveProject}
                />
              ))}
            </div>
          )}
        </div>

        <style>{`
          .prj-page-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: clamp(18px, 2.5vw, 26px);
          }
          @media (max-width: 900px) {
            .prj-page-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
          @media (max-width: 540px) {
            .prj-page-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* Works popup */}
      {activeProject && (
        <WorksModal project={activeProject} onClose={() => setActiveProject(null)} />
      )}

      <style>{`
        @keyframes prjPageShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes prjCardIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes prjOverlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes prjModalIn {
          from { opacity: 0; transform: scale(0.94) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>
  )
}