import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BUILDINGS = [
  {
    id: 1,
    style: 'w-[13%] h-[65%] bottom-0',
    innerStyle: 'w-full h-full',
    gradient: 'from-[#0a1628] via-[#1a3a5c] to-[#0d2040]',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    windows: { cols: 4, rows: 14 },
    shape: 'rounded-t-full',
    city: 'Ahmedabad',
    label: 'SG Highway',
  },
  {
    id: 2,
    style: 'w-[11%] h-[52%] bottom-0',
    innerStyle: 'w-full h-full',
    gradient: 'from-[#0c1a2e] via-[#1e3a5f] to-[#0a1628]',
    glowColor: 'rgba(99, 179, 237, 0.35)',
    windows: { cols: 3, rows: 11 },
    shape: 'rounded-t-sm',
    city: 'Gandhinagar',
    label: 'Sector 1-30',
  },
  {
    id: 3,
    style: 'w-[14%] h-[85%] bottom-0',
    innerStyle: 'w-full h-full',
    gradient: 'from-[#071525] via-[#0f2a4a] to-[#1a3a5c]',
    glowColor: 'rgba(147, 197, 253, 0.5)',
    windows: { cols: 4, rows: 18 },
    shape: 'rounded-t-none',
    city: 'Ahmedabad',
    label: 'Prahlad Nagar',
    spire: true,
  },
  {
    id: 4,
    style: 'w-[12%] h-[58%] bottom-0',
    innerStyle: 'w-full h-full',
    gradient: 'from-[#0a1e35] via-[#1a3050] to-[#0d1a30]',
    glowColor: 'rgba(96, 165, 250, 0.35)',
    windows: { cols: 4, rows: 12 },
    shape: 'rounded-t-sm',
    city: 'Ahmedabad',
    label: 'Bodakdev',
  },
  {
    id: 5,
    style: 'w-[10%] h-[48%] bottom-0',
    innerStyle: 'w-full h-full',
    gradient: 'from-[#0c1f33] via-[#1d3557] to-[#0a1628]',
    glowColor: 'rgba(186, 230, 253, 0.3)',
    windows: { cols: 3, rows: 10 },
    shape: 'rounded-t-lg',
    city: 'Gandhinagar',
    label: 'Gift City',
  },
];

function BuildingWindows({ cols, rows }) {
  return (
    <div
      className="absolute inset-0 p-2"
      style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)`, gap: '3px' }}
    >
      {Array.from({ length: cols * rows }).map((_, i) => (
        <div
          key={i}
          className="rounded-sm"
          style={{
            background: Math.random() > 0.3
              ? `rgba(${Math.random() > 0.5 ? '255, 220, 100' : '150, 200, 255'}, ${0.4 + Math.random() * 0.5})`
              : 'rgba(20, 40, 70, 0.8)',
            animation: Math.random() > 0.7 ? `flicker ${2 + Math.random() * 3}s infinite ${Math.random() * 2}s` : 'none',
          }}
        />
      ))}
    </div>
  );
}

export default function ExploreAhmedabad() {
  const navigate = useNavigate();
  const [hoveredBuilding, setHoveredBuilding] = useState(null);
  const [textOnTop, setTextOnTop] = useState(false);
  const sectionRef = useRef(null);
  const [stars, setStars] = useState([]);
  const [visible, setVisible] = useState(false);

  // Generate stars once
  useEffect(() => {
    const s = Array.from({ length: 150 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 60,
      size: 0.5 + Math.random() * 2,
      opacity: 0.3 + Math.random() * 0.7,
      duration: 2 + Math.random() * 4,
    }));
    setStars(s);
  }, []);

  // Intersection Observer for scroll-in animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleBuildingClick = (building) => {
    navigate(`/explore?city=${building.city}&search=${building.label}`);
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #FAF9F6 0%, #0a0f1e 8%, #050a1a 40%, #030712 100%)',
      }}
    >
      {/* CSS for custom animations */}
      <style>{`
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes starTwinkle {
          0%, 100% { opacity: var(--star-opacity); transform: scale(1); }
          50% { opacity: calc(var(--star-opacity) * 0.3); transform: scale(0.8); }
        }
        @keyframes floatUp {
          from { opacity: 0; transform: translateY(60px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes buildingRise {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .building-wrap {
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.4s ease;
          cursor: pointer;
        }
        .building-wrap:hover {
          transform: scaleY(1.06) scaleX(1.04) translateY(-8px) !important;
        }
        .explore-text-layer {
          transition: z-index 0s, text-shadow 0.5s ease, opacity 0.5s ease;
        }
        .explore-text-layer.text-behind {
          z-index: 5;
        }
        .explore-text-layer.text-front {
          z-index: 30;
        }
      `}</style>

      {/* Starry Sky */}
      <div className="absolute inset-0 pointer-events-none" style={{ top: '8%' }}>
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              '--star-opacity': star.opacity,
              opacity: star.opacity,
              animation: `starTwinkle ${star.duration}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* Ground glow */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '30%',
          background: 'linear-gradient(0deg, rgba(30, 80, 150, 0.15) 0%, transparent 100%)',
        }}
      />

      {/* Main Content */}
      <div
        className="relative w-full flex flex-col items-center justify-end"
        style={{ minHeight: '100vh', paddingTop: '80px' }}
      >
        {/* Top Label */}
        <div
          className="absolute top-24 left-0 right-0 flex flex-col items-center gap-2 pointer-events-none"
          style={{
            animation: visible ? 'floatUp 0.8s ease forwards' : 'none',
            opacity: visible ? 1 : 0,
          }}
        >
          <span className="text-blue-400 text-sm font-semibold tracking-[4px] uppercase">
            ✦ Discover Premium Real Estate ✦
          </span>
        </div>

        {/* Buildings + Text Scene */}
        <div
          className="relative w-full flex items-end justify-center"
          style={{ height: '75vh' }}
          onMouseEnter={() => setTextOnTop(true)}
          onMouseLeave={() => setTextOnTop(false)}
        >
          {/* EXPLORE AHMEDABAD Text — Behind Buildings by default */}
          <div
            className={`explore-text-layer absolute inset-x-0 flex flex-col items-center justify-center pointer-events-none select-none ${textOnTop ? 'text-front' : 'text-behind'}`}
            style={{ bottom: '15%' }}
          >
            <div
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 'clamp(60px, 10vw, 130px)',
                fontWeight: 900,
                letterSpacing: '-2px',
                lineHeight: 0.9,
                textAlign: 'center',
                color: 'transparent',
                WebkitTextStroke: textOnTop ? '2px rgba(147, 210, 255, 0.95)' : '1.5px rgba(147, 210, 255, 0.6)',
                textShadow: textOnTop
                  ? '0 0 60px rgba(100, 180, 255, 0.8), 0 0 120px rgba(100, 180, 255, 0.4), 0 0 200px rgba(59, 130, 246, 0.3)'
                  : '0 0 40px rgba(100, 180, 255, 0.3), 0 0 80px rgba(100, 180, 255, 0.15)',
                transition: 'text-shadow 0.5s ease, -webkit-text-stroke 0.5s ease',
                transform: 'perspective(800px) rotateX(5deg)',
              }}
            >
              <div>EXPLORE</div>
              <div style={{ letterSpacing: '-1px' }}>AHMEDABAD</div>
            </div>
            {textOnTop && (
              <p className="mt-6 text-blue-300 text-base tracking-widest uppercase font-medium opacity-80">
                Your Dream Property Awaits
              </p>
            )}
          </div>

          {/* Buildings Layer */}
          <div
            className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-3 px-8"
            style={{ height: '100%', zIndex: 10 }}
          >
            {BUILDINGS.map((building, idx) => (
              <div
                key={building.id}
                className={`relative flex-shrink-0 building-wrap ${building.style}`}
                style={{
                  animation: visible ? `buildingRise 0.8s ease ${idx * 0.12}s both` : 'none',
                  filter: hoveredBuilding === building.id
                    ? `drop-shadow(0 0 20px ${building.glowColor}) drop-shadow(0 0 40px ${building.glowColor})`
                    : `drop-shadow(0 0 8px ${building.glowColor.replace('0.4', '0.15')})`,
                }}
                onMouseEnter={() => setHoveredBuilding(building.id)}
                onMouseLeave={() => setHoveredBuilding(null)}
                onClick={() => handleBuildingClick(building)}
              >
                {/* Building Body */}
                <div
                  className={`relative w-full h-full bg-gradient-to-b ${building.gradient} ${building.shape} overflow-hidden border border-blue-900/30`}
                >
                  <BuildingWindows cols={building.windows.cols} rows={building.windows.rows} />

                  {/* Reflection overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
                </div>

                {/* Spire for center building */}
                {building.spire && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 bg-gradient-to-b from-blue-200 to-blue-400"
                    style={{ width: '3px', height: '60px', top: '-60px', boxShadow: '0 0 10px rgba(147, 197, 253, 0.8)' }}
                  />
                )}

                {/* Hover tooltip */}
                {hoveredBuilding === building.id && (
                  <div
                    className="absolute -top-16 left-1/2 -translate-x-1/2 bg-blue-900/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-2 rounded-lg whitespace-nowrap border border-blue-400/30 pointer-events-none"
                    style={{ zIndex: 50, animation: 'floatUp 0.2s ease forwards' }}
                  >
                    📍 {building.label}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-900/90 rotate-45 border-r border-b border-blue-400/30" />
                  </div>
                )}

                {/* Ground reflection */}
                <div
                  className={`absolute top-full left-0 right-0 bg-gradient-to-b ${building.gradient} opacity-20`}
                  style={{ height: '30px', transform: 'scaleY(-0.4)', transformOrigin: 'top' }}
                />
              </div>
            ))}
          </div>

          {/* Ground line with glow */}
          <div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(100, 180, 255, 0.5), transparent)',
              boxShadow: '0 0 20px rgba(100, 180, 255, 0.3)',
              zIndex: 15,
            }}
          />
        </div>

        {/* Bottom CTA area */}
        <div
          className="w-full flex flex-col items-center gap-6 py-10"
          style={{ background: 'linear-gradient(0deg, #030712 0%, transparent 100%)', zIndex: 20 }}
        >
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/explore?city=Ahmedabad')}
              className="px-8 py-3 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(147,197,253,0.1))',
                border: '1px solid rgba(147, 197, 253, 0.4)',
                color: '#93c5fd',
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.15)',
              }}
            >
              Explore Ahmedabad
            </button>
            <button
              onClick={() => navigate('/explore?city=Gandhinagar')}
              className="px-8 py-3 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(252,211,77,0.08))',
                border: '1px solid rgba(252, 211, 77, 0.3)',
                color: '#fcd34d',
                boxShadow: '0 0 20px rgba(245, 158, 11, 0.1)',
              }}
            >
              Explore Gandhinagar
            </button>
          </div>
          <div className="text-blue-400/40 text-xs tracking-widest animate-bounce">↓ scroll to see properties ↓</div>
        </div>
      </div>
    </section>
  );
}
