import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

const DEFAULT_BUILDINGS = [
  {
    id: 1,
    image: '/building_left.png',
    widthPct: '20%',
    heightPct: '80%',
    city: 'Gandhinagar',
    label: 'Gift City',
  },
  {
    id: 2,
    image: '/building_right.png',
    widthPct: '16%',
    heightPct: '70%',
    city: 'Gandhinagar',
    label: 'Infocity',
  },
  {
    id: 3,
    image: '/building_center.png',
    widthPct: '28%',
    heightPct: '100%',
    city: 'Gandhinagar',
    label: 'Sector 21',
    isCenter: true,
  },
  {
    id: 4,
    image: '/building_right.png',
    widthPct: '18%',
    heightPct: '78%',
    city: 'Gandhinagar',
    label: 'Kudasan',
    mirror: true,
  },
  {
    id: 5,
    image: '/building_left.png',
    widthPct: '14%',
    heightPct: '65%',
    city: 'Gandhinagar',
    label: 'Randesan',
    mirror: true,
  },
];

export default function ExploreGandhinagar() {
  const navigate = useNavigate();
  const [hoveredBuilding, setHoveredBuilding] = useState(null);
  const [textOnTop, setTextOnTop] = useState(false);
  const sectionRef = useRef(null);
  const [stars, setStars] = useState([]);
  const [visible, setVisible] = useState(false);
  const [buildings, setBuildings] = useState(DEFAULT_BUILDINGS);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const { data, error } = await supabase
          .from('site_assets')
          .select('*')
          // Assuming Gandhinagar might use a specific key pattern or we just use defaults for now
          // If the user wants to configure Gandhinagar separately later, they can add a 'section' column
          .order('asset_key', { ascending: true });
        
        if (error) throw error;
        
        // Since we don't have a way to distinguish Ahmedabad vs Gandhinagar assets in the current schema without changing the admin panel,
        // we will stick to the default Gandhinagar buildings unless the user explicitly asks for Supabase integration here.
        // For now, I'll filter for assets that specifically mention Gandhinagar in their label or city if available, 
        // else fallback to DEFAULT_BUILDINGS so it doesn't just duplicate Ahmedabad exactly.
        const gnrAssets = data?.filter(item => item.city?.toLowerCase() === 'gandhinagar' || item.label?.toLowerCase().includes('gandhinagar'));
        
        if (gnrAssets && gnrAssets.length >= 5) {
          const mapped = gnrAssets.slice(0,5).map((item, idx) => {
            // Hardcode layout pattern to match Ahmedabad's cinematic skyline look perfectly
            const layoutPattern = [
              { w: '20%', h: '80%' },
              { w: '16%', h: '70%' },
              { w: '28%', h: '100%', isCenter: true },
              { w: '18%', h: '78%', mirror: true },
              { w: '14%', h: '65%', mirror: true }
            ][idx];

            return {
              id: item.id,
              image: item.image_url,
              label: item.label,
              city: item.city || 'Gandhinagar',
              widthPct: layoutPattern.w,
              heightPct: layoutPattern.h,
              isCenter: layoutPattern.isCenter || false,
              mirror: layoutPattern.mirror || false,
            };
          });
          setBuildings(mapped);
        }
      } catch (err) {
        console.warn("Failed to fetch site assets, using defaults:", err.message);
      }
    };

    fetchAssets();
  }, []);

  useEffect(() => {
    setStars(
      Array.from({ length: 150 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 90,
        size: 1 + Math.random() * 2,
        opacity: 0.2 + Math.random() * 0.4,
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 3,
      }))
    );
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '110vh',
        overflow: 'hidden',
        background: '#FFFFFF', // Clean white background
      }}
    >
      <style>{`
        @keyframes starTwinkle {
          0%, 100% { opacity: var(--op, 0.3); transform: scale(1); }
          50%       { opacity: calc(var(--op, 0.3) * 0.2); transform: scale(0.8); }
        }
        @keyframes buildingRise {
          from { transform: translateY(200px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes floatInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(8px); }
        }
        .explore-building-wrap {
          transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
                      filter 0.4s ease;
          cursor: pointer;
          transform-origin: bottom center;
        }
        .explore-building-wrap:hover {
          transform: scale(1.03) translateY(-20px) !important;
          z-index: 100 !important;
        }
        .building-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: bottom center;
          display: block;
          transition: filter 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease;
          /* Black and white monochrome look (black strokes effect) */
          filter: grayscale(100%) contrast(1.5) brightness(0.8);
          opacity: 0.8;
        }
        .explore-building-wrap:hover .building-img {
          /* Full original colorful version on hover */
          filter: grayscale(0%) contrast(1.1) sepia(0) hue-rotate(0) saturate(1.1) brightness(1.05);
          opacity: 1;
        }
      `}</style>

      {/* Blueish Stars/Sparkles */}
      <div style={{ position: 'absolute', inset: 0, top: '5%', pointerEvents: 'none', zIndex: 1 }}>
        {stars.map(s => (
          <div key={s.id} style={{
            position: 'absolute',
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            borderRadius: '50%',
            background: '#94a3b8',
            boxShadow: '0 0 10px rgba(148, 163, 184, 0.5)',
            '--op': s.opacity,
            opacity: s.opacity,
            animation: `starTwinkle ${s.duration}s ${s.delay}s ease-in-out infinite`,
          }} />
        ))}
      </div>

      <div style={{
        position: 'relative',
        width: '100%',
        minHeight: '110vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingTop: '80px',
        zIndex: 2,
      }}>

        <div style={{
          position: 'absolute',
          top: '120px',
          left: 0, right: 0,
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none',
          animation: visible ? 'floatInUp 1s ease both' : 'none',
          zIndex: 10,
        }}>
          <span style={{
            color: '#3b82f6',
            fontSize: '0.85rem',
            fontWeight: 800,
            letterSpacing: '5px',
            textTransform: 'uppercase',
            textShadow: '0 0 10px rgba(59,130,246,0.1)',
          }}>
            ✦ Discover Premium Real Estate ✦
          </span>
        </div>

        <div
          style={{ position: 'relative', width: '100%', height: '85vh' }}
          onMouseEnter={() => setTextOnTop(true)}
          onMouseLeave={() => setTextOnTop(false)}
        >

          {/* EXPLORE GANDHINAGAR text - Light Theme */}
          <div style={{
            position: 'absolute',
            left: 0, right: 0,
            bottom: '22%', 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            userSelect: 'none',
            /* Dynamic 3D Text Depth Logic */
            zIndex: hoveredBuilding === buildings[1]?.id ? 30 : hoveredBuilding === buildings[2]?.id ? 15 : 50,
          }}>
            <div style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(30px, 6vw, 90px)', /* Slightly smaller font to fit longer word */
              fontWeight: 900,
              letterSpacing: '-1px',
              lineHeight: 0.85,
              textAlign: 'center',
              color: 'transparent',
              WebkitTextStroke: textOnTop
                ? '3px rgba(120, 190, 255, 1)'
                : '2px rgba(120, 190, 255, 0.7)',
              textShadow: textOnTop
                ? '0 0 40px rgba(120, 190, 255, 0.8), 0 0 20px rgba(120, 190, 255, 0.5)'
                : '0 0 15px rgba(120, 190, 255, 0.3)',
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: 'perspective(1200px) rotateX(10deg)',
            }}>
              <div>EXPLORE</div>
              <div style={{ letterSpacing: '-1px' }}>GANDHINAGAR</div>
            </div>
          </div>

          {/* Buildings row */}
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: '100%',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-around',
            padding: '0 5%',
            zIndex: 30,
          }}>
            {buildings.map((b, idx) => {
              const isHovered = hoveredBuilding === b.id;
              
              // Dynamic 3D Building Depth Logic
              let dynamicZIndex = b.isCenter ? 25 : 20;
              if (hoveredBuilding === buildings[1]?.id) {
                if (idx === 1) dynamicZIndex = 40; // 2nd building OVER text
                if (idx === 2) dynamicZIndex = 20; // 3rd building UNDER text
              } else if (hoveredBuilding === buildings[2]?.id) {
                if (idx === 2) dynamicZIndex = 40; // 3rd building OVER text
                if (idx === 1) dynamicZIndex = 25; // 2nd building OVER text
              }

              return (
                <div
                  key={b.id}
                  className="explore-building-wrap"
                  style={{
                    position: 'relative',
                    flexShrink: 0,
                    width: b.widthPct,
                    height: b.heightPct,
                    animation: visible
                      ? `buildingRise 1.5s ease ${idx * 0.15}s both`
                      : 'none',
                    filter: isHovered
                      ? `drop-shadow(0 0 20px rgba(59,130,246,0.15))`
                      : 'none',
                    zIndex: dynamicZIndex,
                  }}
                  onMouseEnter={() => setHoveredBuilding(b.id)}
                  onMouseLeave={() => setHoveredBuilding(null)}
                  onClick={() => navigate(`/explore?city=${b.city}&search=${b.label}`)}
                >
                  <img
                    src={b.image}
                    alt={b.label}
                    className="building-img"
                    style={{
                      transform: b.mirror ? 'scaleX(-1)' : 'none',
                      mixBlendMode: 'multiply', // Crucial for white background if images have dark silhouette
                    }}
                  />

                  {/* Hover tooltip */}
                  {isHovered && (
                    <div style={{
                      position: 'absolute',
                      top: '10%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'rgba(255,255,255,0.95)',
                      backdropFilter: 'blur(10px)',
                      color: '#1e40af',
                      fontSize: '0.85rem',
                      fontWeight: 900,
                      padding: '10px 24px',
                      borderRadius: '15px',
                      whiteSpace: 'nowrap',
                      border: '2px solid rgba(59,130,246,0.3)',
                      zIndex: 150,
                      animation: 'floatInUp 0.3s ease both',
                      boxShadow: '0 15px 40px rgba(59,130,246,0.1)',
                    }}>
                      📍 {b.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Ground fade - White variant */}
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: '180px',
            background: 'linear-gradient(0deg, #FFFFFF 40%, transparent 100%)',
            zIndex: 10,
            pointerEvents: 'none',
          }} />
        </div>

        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          padding: '50px 0 60px',
          background: '#FFFFFF',
          zIndex: 20,
        }}>
          <div style={{
            color: 'rgba(59,130,246,0.4)',
            fontSize: '0.9rem',
            letterSpacing: '8px',
            textTransform: 'uppercase',
            fontWeight: 700,
            animation: 'scrollBounce 2s ease-in-out infinite',
          }}>
            ↓ scroll for more ↓
          </div>
        </div>
      </div>
    </section>
  );
}
