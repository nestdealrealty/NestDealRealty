import React, { useState, useEffect, useRef } from 'react';

/* ───── icon SVGs (electric-blue outline style) ───── */
const icons = {
  totalProjects: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="9" width="7" height="12" rx="1"/><rect x="14" y="4" width="7" height="17" rx="1"/><path d="M10 15h4"/><path d="M10 19h4"/>
    </svg>
  ),
  ongoing: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="6" width="16" height="14" rx="2"/><path d="M4 10h16"/><path d="M8 6V3"/><path d="M16 6V3"/><circle cx="12" cy="15" r="2"/>
    </svg>
  ),
  completed: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h6"/><path d="M9 11h6"/><path d="M9 15h4"/><path d="M5 7h-1"/><path d="M5 11h-1"/><path d="M5 15h-1"/>
    </svg>
  ),
  upcoming: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18"/><path d="M5 21V7l8-4 8 4v14"/><path d="M9 21v-4h6v4"/><path d="M9 10h1"/><path d="M14 10h1"/><path d="M9 14h1"/><path d="M14 14h1"/>
    </svg>
  ),
  sqftDelivered: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M8 8h6"/><path d="M8 11h6"/><path d="M8 14h3"/>
    </svg>
  ),
  sqftDev: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="14" rx="2"/><path d="M12 6V4"/><path d="M7 12h2"/><path d="M15 12h2"/><path d="M7 16h10"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  homes: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5 12 4l9 5.5"/><path d="M19 9.5V19a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V9.5"/><rect x="9" y="14" width="6" height="6"/>
    </svg>
  ),
  units: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 4v16"/><path d="M15 4v16"/><path d="M4 9h16"/><path d="M4 15h16"/>
    </svg>
  ),
  location: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5 12 4l9 5.5"/><path d="M19 9.5V19a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V9.5"/><rect x="9" y="14" width="6" height="6"/>
    </svg>
  ),
  verified: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 4.8L20 7.6l-4 3.9.9 5.5-4.9-2.6L7.1 17l.9-5.5-4-3.9 5.6-.8z"/><path d="m9 12 2 2 4-4"/>
    </svg>
  ),
  quality: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z"/><path d="M12 6v6l4 2"/>
    </svg>
  ),
  support: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 16v2a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-2"/><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/><path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
    </svg>
  ),
};

const stats = [
  { num: '97', suffix: '+', label: 'Total Projects', sub: 'Across Ahmedabad', icon: icons.totalProjects },
  { num: '9',  suffix: '+', label: 'Ongoing Projects', sub: 'Building Today', icon: icons.ongoing },
  { num: '81', suffix: '+', label: 'Completed Projects', sub: 'Successfully Delivered', icon: icons.completed },
  { num: '7',  suffix: '+', label: 'Upcoming Projects', sub: 'Future Ready', icon: icons.upcoming },
  { num: '43', suffix: 'M+', label: 'Sq.ft Delivered', sub: 'Quality Delivered', icon: icons.sqftDelivered },
  { num: '9',  suffix: 'M+', label: 'Sq.ft Under Development', sub: 'Building The Future', icon: icons.sqftDev },
  { num: '30', suffix: 'K+', label: 'Homes Delivered', sub: 'Happy Families', icon: icons.homes },
  { num: '4',  suffix: 'K+', label: 'Units Under Development', sub: 'Expanding Horizons', icon: icons.units },
];

const features = [
  { icon: icons.location, title: 'Prime Locations', sub: 'Best neighborhoods in Ahmedabad' },
  { icon: icons.verified, title: 'Verified Properties', sub: '100% Verified & Legal' },
  { icon: icons.quality, title: 'Premium Quality', sub: 'World-class construction' },
  { icon: icons.support, title: 'Expert Support', sub: 'Dedicated property advisors' },
];

/* ───── Animated Counter Hook ───── */
function useCounter(target, duration = 2000, startAnimate) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!startAnimate) return;
    let start = 0;
    const end = parseInt(target, 10);
    if (end === 0) return;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, startAnimate]);
  return count;
}

/* ───── Stat Card ───── */
function StatCard({ stat, visible, delay }) {
  const count = useCounter(stat.num, 1800, visible);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? 'rgba(255,255,255,0.98)'
          : 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '32px 28px',
        border: hovered
          ? '1px solid rgba(59,130,246,0.35)'
          : '1px solid rgba(59,130,246,0.1)',
        boxShadow: hovered
          ? '0 8px 40px rgba(59,130,246,0.15), 0 0 0 1px rgba(59,130,246,0.08)'
          : '0 4px 24px rgba(0,0,0,0.04), 0 0 0 1px rgba(255,255,255,0.6)',
        transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        opacity: visible ? 1 : 0,
        animation: visible ? `fadeSlideUp 0.7s ${delay}s ease both` : 'none',
        cursor: 'default',
      }}
    >
      {/* Icon */}
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(59,130,246,0.04) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px',
        border: '1px solid rgba(59,130,246,0.1)',
      }}>
        {stat.icon}
      </div>

      {/* Number */}
      <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '6px' }}>
        <span style={{
          fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
          fontWeight: 800,
          color: '#0f172a',
          fontFamily: "'Outfit', sans-serif",
          lineHeight: 1,
        }}>
          {count}
        </span>
        <span style={{
          fontSize: 'clamp(1rem, 1.8vw, 1.4rem)',
          fontWeight: 700,
          color: '#22c55e',
          fontFamily: "'Outfit', sans-serif",
          marginLeft: '2px',
        }}>
          {stat.suffix}
        </span>
      </div>

      {/* Label */}
      <div style={{
        fontSize: '0.95rem',
        fontWeight: 700,
        color: '#1e293b',
        marginBottom: '4px',
        fontFamily: "'Outfit', sans-serif",
      }}>
        {stat.label}
      </div>

      {/* Subtitle */}
      <div style={{
        fontSize: '0.8rem',
        fontWeight: 400,
        color: '#94a3b8',
        fontFamily: "'Outfit', sans-serif",
      }}>
        {stat.sub}
      </div>
    </div>
  );
}

/* ───── Main Component ───── */
export default function ExploreAhmedabad() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 3,
        opacity: 0.15 + Math.random() * 0.25,
        dur: 4 + Math.random() * 6,
        delay: Math.random() * 5,
      }))
    );
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #f0f7ff 0%, #ffffff 40%, #f0f7ff 100%)',
        padding: '100px 20px 80px',
      }}
    >
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes particleFloat {
          0%, 100% { transform: translateY(0) scale(1); opacity: var(--p-op); }
          50%      { transform: translateY(-20px) scale(1.3); opacity: calc(var(--p-op) * 0.4); }
        }
        @keyframes skylinePulse {
          0%, 100% { opacity: 0.07; }
          50%      { opacity: 0.12; }
        }
      `}</style>

      {/* ── Skyline silhouette background ── */}
      <div style={{
        position: 'absolute',
        bottom: '60px',
        left: 0,
        right: 0,
        height: '280px',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 280'%3E%3Cpath fill='%233b82f6' d='M0 280V200h40v-30h20v-40h15v40h25v-60h20v-30h15v30h20v60h30v-80h15v-20h10v20h15v80h40v-50h20v-30h10v30h20v50h50v-100h15v-20h15v20h15v100h40v-40h20v-20h10v20h20v40h60v-70h20v-40h15v40h20v70h50v-90h10v-30h20v30h10v90h40v-50h15v-20h10v20h15v50h30v-120h20v-20h10v20h20v120h50v-60h15v-30h10v30h15v60h60v-40h20v-30h15v30h20v40h30v-70h10v-20h20v20h10v70h40v-40h20v40h60V280z'/%3E%3C/svg%3E")`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        opacity: 0.06,
        animation: 'skylinePulse 8s ease-in-out infinite',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* ── Floating particles ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {particles.map(p => (
          <div key={p.id} style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '50%',
            background: 'rgba(59,130,246,0.5)',
            boxShadow: '0 0 8px rgba(59,130,246,0.3)',
            '--p-op': p.opacity,
            opacity: p.opacity,
            animation: `particleFloat ${p.dur}s ${p.delay}s ease-in-out infinite`,
          }} />
        ))}
      </div>

      {/* ── Ambient glow blobs ── */}
      <div style={{
        position: 'absolute', top: '-100px', left: '-100px', width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', bottom: '-80px', right: '-80px', width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ────────── CONTENT ────────── */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1300px', margin: '0 auto' }}>

        {/* Top label */}
        <div style={{
          textAlign: 'center',
          marginBottom: '16px',
          opacity: visible ? 1 : 0,
          animation: visible ? 'fadeSlideUp 0.6s 0s ease both' : 'none',
        }}>
          <span style={{
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '4px',
            textTransform: 'uppercase',
            color: '#3b82f6',
            fontFamily: "'Outfit', sans-serif",
          }}>
            ✦&nbsp;&nbsp; DISCOVER PREMIUM REAL ESTATE &nbsp;&nbsp;✦
          </span>
        </div>

        {/* Main heading */}
        <div style={{
          textAlign: 'center',
          marginBottom: '12px',
          opacity: visible ? 1 : 0,
          animation: visible ? 'fadeSlideUp 0.7s 0.15s ease both' : 'none',
        }}>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(3rem, 7vw, 6rem)',
            fontWeight: 900,
            lineHeight: 0.95,
            margin: 0,
            letterSpacing: '-2px',
          }}>
            <span style={{ color: '#0f172a', display: 'block' }}>EXPLORE</span>
            <span style={{
              display: 'block',
              background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 40%, #60a5fa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              AHMEDABAD
            </span>
          </h2>
        </div>

        {/* Decorative diamond */}
        <div style={{
          textAlign: 'center',
          marginBottom: '8px',
          opacity: visible ? 1 : 0,
          animation: visible ? 'fadeSlideUp 0.6s 0.25s ease both' : 'none',
        }}>
          <span style={{ color: '#3b82f6', fontSize: '1rem' }}>✦</span>
        </div>

        {/* Subtext */}
        <div style={{
          textAlign: 'center',
          marginBottom: '64px',
          opacity: visible ? 1 : 0,
          animation: visible ? 'fadeSlideUp 0.7s 0.3s ease both' : 'none',
        }}>
          <p style={{
            fontSize: '1.05rem',
            fontWeight: 400,
            color: '#64748b',
            fontFamily: "'Outfit', sans-serif",
            margin: 0,
            fontStyle: 'italic',
          }}>
            Find exceptional properties in prime locations.
          </p>
        </div>

        {/* ── Stats Grid ── */}
        <style>{`
          .ea-stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-bottom: 48px;
          }
          @media (max-width: 1024px) {
            .ea-stats-grid { grid-template-columns: repeat(2, 1fr); }
          }
          @media (max-width: 600px) {
            .ea-stats-grid { grid-template-columns: 1fr; }
          }
        `}</style>
        <div className="ea-stats-grid">
          {stats.map((s, i) => (
            <StatCard key={i} stat={s} visible={visible} delay={0.35 + i * 0.08} />
          ))}
        </div>

        {/* ── Bottom Feature Bar ── */}
        <div style={{
          opacity: visible ? 1 : 0,
          animation: visible ? 'fadeSlideUp 0.8s 1s ease both' : 'none',
        }}>
          <div className="ea-feature-bar" style={{
            background: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(59,130,246,0.08)',
            boxShadow: '0 4px 30px rgba(0,0,0,0.04)',
            padding: '24px 40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}>
            <style>{`
              @media (max-width: 768px) {
                .ea-feature-bar {
                  flex-direction: column !important;
                  align-items: flex-start !important;
                  padding: 24px !important;
                }
              }
            `}</style>
            {features.map((f, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                flex: '1 1 200px',
                borderRight: i < features.length - 1 ? '1px solid rgba(59,130,246,0.1)' : 'none',
                paddingRight: i < features.length - 1 ? '24px' : '0',
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(59,130,246,0.03))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(59,130,246,0.1)',
                  flexShrink: 0,
                }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    fontFamily: "'Outfit', sans-serif",
                    marginBottom: '2px',
                  }}>
                    {f.title}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: 400,
                    color: '#94a3b8',
                    fontFamily: "'Outfit', sans-serif",
                  }}>
                    {f.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
