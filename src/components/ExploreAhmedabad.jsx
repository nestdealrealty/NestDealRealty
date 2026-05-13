import React, { useState, useEffect, useRef } from 'react';

/* ───── icon SVGs (blue outline + green accent style) ───── */
const icons = {
  /* Total Projects — two buildings with green windows */
  totalProjects: (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
      {/* Tall building right */}
      <rect x="24" y="6" width="16" height="36" rx="2" stroke="#3b82f6" strokeWidth="2" />
      {/* Short building left */}
      <rect x="6" y="16" width="14" height="26" rx="2" stroke="#3b82f6" strokeWidth="2" />
      {/* Green windows - left building */}
      <rect x="9" y="20" width="3" height="5" rx="0.5" fill="#ffdd00ff" />
      <rect x="14" y="20" width="3" height="5" rx="0.5" fill="#ffdd00ff" />
      <rect x="9" y="28" width="3" height="5" rx="0.5" fill="#ffdd00ff" />
      <rect x="14" y="28" width="3" height="5" rx="0.5" fill="#ffdd00ff" />
      {/* Green windows - right building */}
      <rect x="27" y="10" width="3" height="5" rx="0.5" fill="#ffdd00ff" />
      <rect x="33" y="10" width="3" height="5" rx="0.5" fill="#ffdd00ff" />
      <rect x="27" y="18" width="3" height="5" rx="0.5" fill="#ffdd00ff" />
      <rect x="33" y="18" width="3" height="5" rx="0.5" fill="#ffdd00ff" />
      <rect x="27" y="26" width="3" height="5" rx="0.5" fill="#ffdd00ff" />
      <rect x="33" y="26" width="3" height="5" rx="0.5" fill="#ffdd00ff" />
      {/* Door */}
      <rect x="30" y="34" width="5" height="8" rx="1" stroke="#3b82f6" strokeWidth="1.5" />
      {/* Ground line */}
      <line x1="2" y1="42" x2="46" y2="42" stroke="#3b82f6" strokeWidth="2" />
    </svg>
  ),

  /* Ongoing Projects — cement mixer truck */
  ongoing: (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
      {/* Truck body */}
      <rect x="4" y="24" width="20" height="12" rx="2" stroke="#3b82f6" strokeWidth="2" />
      {/* Cabin */}
      <path d="M24 28h8a2 2 0 0 1 2 2v6H24V28z" stroke="#3b82f6" strokeWidth="2" />
      {/* Cabin window */}
      <rect x="26" y="30" width="5" height="3" rx="0.5" fill="#ffdd00ff" opacity="0.5" />
      {/* Mixer drum */}
      <path d="M8 24V14a8 8 0 0 1 12-6.9L22 8" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="14" cy="14" rx="7" ry="5" stroke="#3b82f6" strokeWidth="2" transform="rotate(-20 14 14)" />
      {/* Green cement in drum */}
      <ellipse cx="14" cy="15" rx="4" ry="2.5" fill="#ffdd00ff" opacity="0.4" transform="rotate(-20 14 15)" />
      {/* Drum stripes */}
      <path d="M9 11l10 5" stroke="#3b82f6" strokeWidth="1" opacity="0.5" />
      <path d="M9 14l10 5" stroke="#3b82f6" strokeWidth="1" opacity="0.5" />
      {/* Wheels */}
      <circle cx="11" cy="38" r="3" stroke="#3b82f6" strokeWidth="2" />
      <circle cx="11" cy="38" r="1" fill="#3b82f6" />
      <circle cx="29" cy="38" r="3" stroke="#3b82f6" strokeWidth="2" />
      <circle cx="29" cy="38" r="1" fill="#3b82f6" />
      {/* Ground */}
      <line x1="2" y1="42" x2="46" y2="42" stroke="#3b82f6" strokeWidth="1.5" />
    </svg>
  ),

  /* Ready To Move — completed building with grid windows */
  completed: (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
      {/* Building */}
      <rect x="10" y="8" width="28" height="34" rx="2" stroke="#3b82f6" strokeWidth="2" />
      {/* Roof accent */}
      <rect x="10" y="8" width="28" height="4" rx="2" fill="#3b82f6" opacity="0.15" />
      {/* Window grid - row 1 */}
      <rect x="14" y="14" width="4" height="4" rx="0.5" fill="#ffdd00ff" />
      <rect x="22" y="14" width="4" height="4" rx="0.5" fill="#ffdd00ff" />
      <rect x="30" y="14" width="4" height="4" rx="0.5" fill="#ffdd00ff" />
      {/* Window grid - row 2 */}
      <rect x="14" y="22" width="4" height="4" rx="0.5" fill="#ffdd00ff" />
      <rect x="22" y="22" width="4" height="4" rx="0.5" fill="#ffdd00ff" />
      <rect x="30" y="22" width="4" height="4" rx="0.5" fill="#ffdd00ff" />
      {/* Window grid - row 3 */}
      <rect x="14" y="30" width="4" height="4" rx="0.5" fill="#ffdd00ff" />
      <rect x="22" y="30" width="4" height="4" rx="0.5" fill="#ffdd00ff" />
      <rect x="30" y="30" width="4" height="4" rx="0.5" fill="#ffdd00ff" />
      {/* Door */}
      <rect x="20" y="36" width="8" height="6" rx="1" stroke="#3b82f6" strokeWidth="1.5" />
      {/* Checkmark badge */}
      <circle cx="38" cy="10" r="5" fill="#ffdd00ff" />
      <path d="M35.5 10l1.8 1.8 3.2-3.2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Ground */}
      <line x1="6" y1="42" x2="42" y2="42" stroke="#3b82f6" strokeWidth="2" />
    </svg>
  ),

  /* Apartments — multi-floor building */
  apartments: (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
      {/* Main building */}
      <rect x="8" y="6" width="32" height="36" rx="2" stroke="#3b82f6" strokeWidth="2" />
      {/* Floor lines */}
      <line x1="8" y1="16" x2="40" y2="16" stroke="#3b82f6" strokeWidth="1" opacity="0.3" />
      <line x1="8" y1="26" x2="40" y2="26" stroke="#3b82f6" strokeWidth="1" opacity="0.3" />
      {/* Windows - floor 1 */}
      <rect x="12" y="8" width="5" height="5" rx="0.5" fill="#ffdd00ff" />
      <rect x="21" y="8" width="5" height="5" rx="0.5" fill="#ffdd00ff" />
      <rect x="30" y="8" width="5" height="5" rx="0.5" fill="#ffdd00ff" />
      {/* Windows - floor 2 */}
      <rect x="12" y="18" width="5" height="5" rx="0.5" fill="#ffdd00ff" />
      <rect x="21" y="18" width="5" height="5" rx="0.5" fill="#ffdd00ff" />
      <rect x="30" y="18" width="5" height="5" rx="0.5" fill="#ffdd00ff" />
      {/* Windows - floor 3 */}
      <rect x="12" y="28" width="5" height="5" rx="0.5" fill="#ffdd00ff" />
      <rect x="21" y="28" width="5" height="5" rx="0.5" fill="#ffdd00ff" />
      <rect x="30" y="28" width="5" height="5" rx="0.5" fill="#ffdd00ff" />
      {/* Entrance */}
      <rect x="19" y="36" width="10" height="6" rx="1.5" stroke="#3b82f6" strokeWidth="1.5" />
      {/* Ground */}
      <line x1="4" y1="42" x2="44" y2="42" stroke="#3b82f6" strokeWidth="2" />
    </svg>
  ),

  /* Villas — house with pitched roof */
  villas: (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
      {/* Roof */}
      <path d="M6 22L24 8l18 14" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 20L24 10l14 10" fill="#ffdd00ff" opacity="0.2" />
      {/* House body */}
      <rect x="10" y="22" width="28" height="18" rx="1" stroke="#3b82f6" strokeWidth="2" />
      {/* Chimney */}
      <rect x="32" y="12" width="4" height="10" stroke="#3b82f6" strokeWidth="1.5" />
      {/* Windows */}
      <rect x="14" y="25" width="6" height="5" rx="0.5" fill="#ffdd00ff" />
      <rect x="28" y="25" width="6" height="5" rx="0.5" fill="#ffdd00ff" />
      {/* Door */}
      <rect x="21" y="30" width="6" height="10" rx="1" stroke="#3b82f6" strokeWidth="1.5" />
      <circle cx="25.5" cy="36" r="0.8" fill="#3b82f6" />
      {/* Garden */}
      <circle cx="8" cy="38" r="3" fill="#ffdd00ff" opacity="0.3" />
      <circle cx="40" cy="38" r="3" fill="#ffdd00ff" opacity="0.3" />
      {/* Ground */}
      <line x1="4" y1="40" x2="44" y2="40" stroke="#3b82f6" strokeWidth="2" />
    </svg>
  ),

  /* Commercial — office building with briefcase */
  commercial: (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
      {/* Building */}
      <rect x="12" y="4" width="24" height="34" rx="2" stroke="#3b82f6" strokeWidth="2" />
      {/* Top accent bar */}
      <rect x="12" y="4" width="24" height="3" fill="#3b82f6" opacity="0.2" />
      {/* Windows */}
      <rect x="16" y="10" width="5" height="4" rx="0.5" fill="#ffdd00ff" />
      <rect x="27" y="10" width="5" height="4" rx="0.5" fill="#ffdd00ff" />
      <rect x="16" y="18" width="5" height="4" rx="0.5" fill="#ffdd00ff" />
      <rect x="27" y="18" width="5" height="4" rx="0.5" fill="#ffdd00ff" />
      <rect x="16" y="26" width="5" height="4" rx="0.5" fill="#ffdd00ff" />
      <rect x="27" y="26" width="5" height="4" rx="0.5" fill="#ffdd00ff" />
      {/* Door */}
      <rect x="20" y="33" width="8" height="5" rx="1" stroke="#3b82f6" strokeWidth="1.5" />
      {/* Briefcase icon at bottom */}
      <rect x="17" y="40" width="14" height="6" rx="1.5" stroke="#3b82f6" strokeWidth="1.5" />
      <path d="M21 40v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke="#3b82f6" strokeWidth="1.5" />
      <line x1="24" y1="42" x2="24" y2="44" stroke="#3b82f6" strokeWidth="1" />
    </svg>
  ),

  /* Plots — land with boundary markers */
  plots: (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
      {/* Land area with green fill */}
      <path d="M6 38L12 20h24l6 18H6z" fill="#ffdd00ff" opacity="0.15" />
      <path d="M6 38L12 20h24l6 18H6z" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round" />
      {/* Fence posts */}
      <line x1="12" y1="20" x2="12" y2="14" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="20" x2="24" y2="14" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
      <line x1="36" y1="20" x2="36" y2="14" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
      {/* Fence horizontal bars */}
      <line x1="12" y1="15" x2="24" y2="15" stroke="#3b82f6" strokeWidth="1.5" />
      <line x1="24" y1="15" x2="36" y2="15" stroke="#3b82f6" strokeWidth="1.5" />
      <line x1="12" y1="18" x2="24" y2="18" stroke="#3b82f6" strokeWidth="1.5" />
      <line x1="24" y1="18" x2="36" y2="18" stroke="#3b82f6" strokeWidth="1.5" />
      {/* Area measurement marks */}
      <path d="M10 42h28" stroke="#ffdd00ff" strokeWidth="1.5" strokeDasharray="3 2" />
      <path d="M10 42v-2M38 42v-2" stroke="#ffdd00ff" strokeWidth="1.5" />
      {/* Tree */}
      <circle cx="20" cy="28" r="3" fill="#ffdd00ff" opacity="0.5" />
      <line x1="20" y1="31" x2="20" y2="34" stroke="#ffdd00ff" strokeWidth="1.5" />
      {/* Ground */}
      <line x1="2" y1="38" x2="46" y2="38" stroke="#3b82f6" strokeWidth="2" />
    </svg>
  ),

  /* Feature bar icons (kept smaller) */
  location: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5 12 4l9 5.5" /><path d="M19 9.5V19a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V9.5" /><rect x="9" y="14" width="6" height="6" />
    </svg>
  ),
  verified: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 4.8L20 7.6l-4 3.9.9 5.5-4.9-2.6L7.1 17l.9-5.5-4-3.9 5.6-.8z" /><path d="m9 12 2 2 4-4" />
    </svg>
  ),
  quality: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z" /><path d="M12 6v6l4 2" />
    </svg>
  ),
  support: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 16v2a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-2" /><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" /><path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    </svg>
  ),
};


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
import { supabase } from '../supabase';

export default function ExploreAhmedabad() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [particles, setParticles] = useState([]);
  const [dynamicStats, setDynamicStats] = useState({
    total: 0,
    ongoing: 0,
    ready: 0,
    apartments: 0,
    villas: 0,
    commercial: 0,
    plots: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('property_type, construction_status')
        .eq('status', 'approved')
        .ilike('city', 'ahmedabad');

      if (data && !error) {
        const total = data.length;
        const ongoing = data.filter(p => p.construction_status === 'Under Construction' || p.construction_status === 'New Launch').length;
        const ready = data.filter(p => p.construction_status === 'Ready to Move').length;
        const apartments = data.filter(p => p.property_type === 'Flat' || p.property_type === 'Apartment').length;
        const villas = data.filter(p => p.property_type === 'Villa' || p.property_type === 'Bunglows' || p.property_type === 'Weekend Homes').length;
        const commercial = data.filter(p => p.property_type === 'Commercial').length;
        const plots = data.filter(p => p.property_type === 'Plots').length;

        setDynamicStats({ total, ongoing, ready, apartments, villas, commercial, plots });
      }
    };
    fetchStats();
  }, []);

  const currentStats = [
    { num: dynamicStats.total.toString(), suffix: '', label: 'Total Projects', sub: 'Across Ahmedabad', icon: icons.totalProjects },
    { num: dynamicStats.ongoing.toString(), suffix: '', label: 'Ongoing Projects', sub: 'Building Today', icon: icons.ongoing },
    { num: dynamicStats.ready.toString(), suffix: '', label: 'Ready To Move Projects', sub: 'Successfully Delivered', icon: icons.completed },
    { num: dynamicStats.apartments.toString(), suffix: '', label: 'APARTMENTS', sub: 'Premium Flats', icon: icons.apartments },
    { num: dynamicStats.villas.toString(), suffix: '', label: 'VILLAS', sub: 'Luxury Living', icon: icons.villas },
    { num: dynamicStats.commercial.toString(), suffix: '', label: 'COMMERCIAL', sub: 'Business Spaces', icon: icons.commercial },
    { num: dynamicStats.plots.toString(), suffix: '', label: 'PLOTS', sub: 'Land & Investment', icon: icons.plots },
  ];

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

        {/* ── Stats Grid - Pyramid Layout ── */}
        <style>{`
          .ea-stats-row-top {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 20px;
            max-width: 900px;
            margin-left: auto;
            margin-right: auto;
          }
          .ea-stats-row-bottom {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-bottom: 48px;
          }
          @media (max-width: 1024px) {
            .ea-stats-row-top { grid-template-columns: repeat(3, 1fr); max-width: 100%; }
            .ea-stats-row-bottom { grid-template-columns: repeat(2, 1fr); }
          }
          @media (max-width: 600px) {
            .ea-stats-row-top { grid-template-columns: 1fr; }
            .ea-stats-row-bottom { grid-template-columns: 1fr; }
          }
        `}</style>
        {/* Top Row - 3 items centered */}
        <div className="ea-stats-row-top">
          {currentStats.slice(0, 3).map((s, i) => (
            <StatCard key={i} stat={s} visible={visible} delay={0.35 + i * 0.08} />
          ))}
        </div>
        {/* Bottom Row - 4 items */}
        <div className="ea-stats-row-bottom">
          {currentStats.slice(3).map((s, i) => (
            <StatCard key={i + 3} stat={s} visible={visible} delay={0.6 + i * 0.08} />
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
