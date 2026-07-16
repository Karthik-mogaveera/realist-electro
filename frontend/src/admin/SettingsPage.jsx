// src/admin/SettingsPage.jsx
// ─────────────────────────────────────────────────────────────
// Admin Settings — 4 modular tabs:
//   Information | Social Media | SEO | Security
// Each tab is a fully self-contained module in ./settings/
// ─────────────────────────────────────────────────────────────
import { useState } from 'react';
import InformationTab from './settings/InformationTab';
import SocialTab      from './settings/SocialTab';
import SEOTab         from './settings/SEOTab';
import SecurityTab    from './settings/SecurityTab';

const TABS = [
  { id: 'information', label: 'Information', icon: '🏢', desc: 'Logo, contact & address' },
  { id: 'social',      label: 'Social Media', icon: '🌐', desc: 'Platform links'         },
  { id: 'seo',         label: 'SEO',          icon: '🔍', desc: 'Meta tags & Open Graph'  },
  { id: 'security',    label: 'Security',     icon: '🔒', desc: 'Access & password'       },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('information');

  return (
    <div style={{ fontFamily: 'Outfit, sans-serif' }}>

      {/* ── Page header ── */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{
          fontFamily: 'Sora, serif',
          fontSize: 'clamp(20px,2.5vw,26px)', fontWeight: 700,
          color: '#1A2332', margin: '0 0 4px'
        }}>Settings</h1>
        <p style={{ color: '#6B7280', fontSize: 13, margin: 0 }}>
          Configure your website information, social links, SEO and security.
        </p>
      </div>

      {/* ── Settings layout: sidebar + content ── */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

        {/* Sidebar tab list */}
        <div style={{
          width: 220, flexShrink: 0,
          background: 'white', borderRadius: 16,
          border: '1px solid rgba(11,31,58,0.08)',
          boxShadow: '0 2px 12px rgba(11,31,58,0.05)',
          padding: '10px', position: 'sticky', top: 84
        }}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  width: '100%', padding: '12px 14px', borderRadius: 11,
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  background: isActive
                    ? 'linear-gradient(135deg, #f2984a10, #f2984a17)'
                    : 'transparent',
                  transition: 'all 0.18s',
                  marginBottom: 2,
                  outline: isActive ? '1px solid #F2994A' : 'none'
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#F9FAFB'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                {/* Icon */}
                <div style={{
                  width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                  background: isActive ? '#f371001f' : 'rgba(11,31,58,0.05)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 17, transition: 'background 0.2s'
                }}>{tab.icon}</div>

                {/* Label */}
                <div>
                  <div style={{
                    fontSize: 13, fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#F2994A' : '#3F4A5A',
                    lineHeight: 1.3, transition: 'color 0.2s'
                  }}>{tab.label}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>
                    {tab.desc}
                  </div>
                </div>

                {/* Active indicator */}
                {isActive && (
                  <div style={{
                    marginLeft: 'auto', width: 6, height: 6,
                    borderRadius: '50%', background: '#F2994A', flexShrink: 0
                  }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {activeTab === 'information' && <InformationTab />}
          {activeTab === 'social'      && <SocialTab />}
          {activeTab === 'seo'         && <SEOTab />}
          {activeTab === 'security'    && <SecurityTab />}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="display: 'flex'"][style*="gap: 24"] {
            flex-direction: column !important;
          }
          div[style*="width: 220"][style*="position: sticky"] {
            width: 100% !important;
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
}