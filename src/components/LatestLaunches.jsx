import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';

const FourPointStar = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#1e3a8a] mx-4">
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="currentColor"/>
  </svg>
);

const defaultProperties = [
  {
    id: 1, name: 'The Horizon', city: 'Ahmedabad',
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop',
    pos: { left: '0%', top: '0%', width: '18%', height: '58%' }
  },
  {
    id: 2, name: 'Aura Villas', city: 'Gandhinagar',
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop',
    pos: { left: '0%', top: '60%', width: '18%', height: '40%' }
  },
  {
    id: 3, name: 'Skyline', city: 'Ahmedabad',
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
    pos: { left: '20%', top: '0%', width: '16%', height: '38%' }
  },
  {
    id: 4, name: 'Emerald', city: 'Gandhinagar',
    img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop',
    pos: { left: '20%', top: '40%', width: '16%', height: '60%' }
  },
  {
    id: 5, name: 'The Crown', city: 'Ahmedabad',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    pos: { left: '38%', top: '0%', width: '28%', height: '68%' }
  },
  {
    id: 6, name: 'Zenith', city: 'Ahmedabad',
    img: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=800&auto=format&fit=crop',
    pos: { left: '38%', top: '70%', width: '28%', height: '30%' }
  },
  {
    id: 7, name: 'Nova Park', city: 'Gandhinagar',
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
    pos: { left: '68%', top: '0%', width: '32%', height: '38%' }
  },
  {
    id: 8, name: 'Apex Point', city: 'Ahmedabad',
    img: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=800&auto=format&fit=crop',
    pos: { left: '68%', top: '40%', width: '15%', height: '60%' }
  },
  {
    id: 9, name: 'Luxe Loft', city: 'Ahmedabad',
    img: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=800&auto=format&fit=crop',
    pos: { left: '85%', top: '40%', width: '15%', height: '60%' }
  }
];


function PropertyCard({ prop }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link 
      to={`/project/${prop.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '20px',
        cursor: 'pointer',
        display: 'block',
        height: '100%'
      }}
    >
      {/* Image */}
      <img
        src={prop.img}
        alt={prop.name}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transform: hovered ? 'scale(1.07)' : 'scale(1)',
          transition: 'transform 0.7s ease-out',
        }}
        onError={(e) => {
          e.target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop';
        }}
      />

      {/* Black Fade Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.35s ease',
          zIndex: 1,
        }}
      />

      {/* Centered Project Name + City */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '16px',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(14px)',
          transition: 'opacity 0.35s ease, transform 0.35s ease',
          zIndex: 2,
        }}
      >
        <h3
          style={{
            color: '#ffffff',
            fontSize: 'clamp(1rem, 2vw, 1.6rem)',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '6px',
            fontFamily: "'Outfit', sans-serif",
            margin: '0 0 6px 0',
          }}
        >
          {prop.name}
        </h3>
        <p
          style={{
            color: '#d1d5db',
            fontSize: 'clamp(0.7rem, 1.2vw, 0.95rem)',
            fontStyle: 'italic',
            fontWeight: 300,
            margin: 0,
          }}
        >
          {prop.city}
        </p>
      </div>
    </Link>
  );
}

export default function LatestLaunches({ city = "Ahmedabad", area = null, trendingProjects = null }) {
  const [particles, setParticles] = useState([]);
  const [areaTrending, setAreaTrending] = useState(null);
  
  useEffect(() => {
    const fetchAreaTrending = async () => {
      try {
        // 1. Find the correct dictionary record (either area-specific or city-level)
        let query = supabase.from('locations_dictionary').select('id').eq('city', city);
        
        if (area) {
          query = query.ilike('area', area);
        } else {
          // If no area, look for the "City Only" entry (area is empty or null)
          query = query.or('area.eq.,area.is.null');
        }

        const { data: areaRecord } = await query.maybeSingle();

        if (areaRecord) {
          // 2. Fetch assigned trending projects
          const { data: trending } = await supabase
            .from('area_trending_projects')
            .select('*, projects(*)')
            .eq('area_id', areaRecord.id)
            .order('slot_number');

          if (trending && trending.length > 0) {
            setAreaTrending(trending.map(t => t.projects).filter(Boolean));
          } else {
            setAreaTrending(null);
          }
        } else {
          setAreaTrending(null);
        }
      } catch (err) {
        console.error("Error fetching trending projects:", err);
        setAreaTrending(null);
      }
    };

    fetchAreaTrending();
  }, [area, city]);

  const extractImageUrl = (images, index = 0) => {
    if (!images) return null;
    let imgArray = images;
    if (typeof images === 'string') {
      try {
        imgArray = JSON.parse(images);
      } catch (e) {
        // Fallback for comma-separated strings or single URLs
        if (images.includes(',')) {
          imgArray = images.split(',').map(s => s.trim());
        } else {
          imgArray = [images.trim()];
        }
      }
    }
    
    if (Array.isArray(imgArray) && imgArray.length > 0) {
      const img = imgArray[index % imgArray.length];
      return typeof img === 'string' ? img : (img?.url || img);
    }
    
    return typeof imgArray === 'string' ? imgArray : null;
  };

  const projectsToDisplay = areaTrending || trendingProjects || [];
  
  const displayProjects = projectsToDisplay.length > 0 
    ? projectsToDisplay.slice(0, 9).map((p, i) => {
        const imgUrl = extractImageUrl(p.images, 0) || defaultProperties[i % defaultProperties.length].img;

        return {
          id: p.id || i,
          name: p.name || p.title || 'Project',
          city: p.city || p.location || city,
          img: imgUrl,
          pos: defaultProperties[i % defaultProperties.length].pos
        };
      })
    : defaultProperties;

  useEffect(() => {
    setParticles(
      Array.from({ length: 35 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 3,
        opacity: 0.12 + Math.random() * 0.2,
        dur: 4 + Math.random() * 6,
        delay: Math.random() * 5,
      }))
    );
  }, []);

  return (
    <section style={{
      position: 'relative',
      width: '100%',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #f0f7ff 0%, #ffffff 40%, #f0f7ff 100%)',
      padding: '96px 16px',
    }}>
      <style>{`
        @keyframes llParticleFloat {
          0%, 100% { transform: translateY(0) scale(1); opacity: var(--p-op); }
          50%      { transform: translateY(-18px) scale(1.3); opacity: calc(var(--p-op) * 0.4); }
        }
        @keyframes llSkylinePulse {
          0%, 100% { opacity: 0.06; }
          50%      { opacity: 0.1; }
        }
      `}</style>

      {/* Skyline silhouette */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: 0,
        right: 0,
        height: '250px',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 280'%3E%3Cpath fill='%233b82f6' d='M0 280V200h40v-30h20v-40h15v40h25v-60h20v-30h15v30h20v60h30v-80h15v-20h10v20h15v80h40v-50h20v-30h10v30h20v50h50v-100h15v-20h15v20h15v100h40v-40h20v-20h10v20h20v40h60v-70h20v-40h15v40h20v70h50v-90h10v-30h20v30h10v90h40v-50h15v-20h10v20h15v50h30v-120h20v-20h10v20h20v120h50v-60h15v-30h10v30h15v60h60v-40h20v-30h15v30h20v40h30v-70h10v-20h20v20h10v70h40v-40h20v40h60V280z'/%3E%3C/svg%3E")`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        opacity: 0.06,
        animation: 'llSkylinePulse 8s ease-in-out infinite',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Floating particles */}
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
            animation: `llParticleFloat ${p.dur}s ${p.delay}s ease-in-out infinite`,
          }} />
        ))}
      </div>

      {/* Ambient glow blobs */}
      <div style={{
        position: 'absolute', top: '-80px', left: '-80px', width: '450px', height: '450px',
        background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', bottom: '-60px', right: '-60px', width: '380px', height: '380px',
        background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '0 32px' }}>

        {/* ────────── CONTENT ────────── */}
        <div style={{
          textAlign: 'center',
          marginBottom: '64px',
        }}>
          {/* Top label */}
          <div style={{ marginBottom: '16px' }}>
            <span style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '4px',
              textTransform: 'uppercase',
              color: '#3b82f6',
              fontFamily: "'Outfit', sans-serif",
              textShadow: '0 0 12px rgba(59,130,246,0.3)',
            }}>
              ✦&nbsp;&nbsp; CRAFTING LANDMARKS FOR GENERATIONS &nbsp;&nbsp;✦
            </span>
          </div>

          {/* Main heading */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '16px',
          }}>
            <span style={{ color: '#3b82f6', fontSize: '2rem', marginRight: '24px', textShadow: '0 0 15px rgba(59,130,246,0.5)' }}>✦</span>
            <h2 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 900,
              color: '#0f172a',
              lineHeight: 1,
              margin: 0,
              letterSpacing: '-1px',
              textTransform: 'uppercase',
            }}>
              TRENDING PROJECTS IN {area || city}
            </h2>
            <span style={{ color: '#3b82f6', fontSize: '2rem', marginLeft: '24px', textShadow: '0 0 15px rgba(59,130,246,0.5)' }}>✦</span>
          </div>

          {/* Subtext */}
          <div>
            <p style={{
              fontSize: '1.05rem',
              fontWeight: 400,
              color: '#64748b',
              fontFamily: "'Outfit', sans-serif",
              margin: 0,
              fontStyle: 'italic',
            }}>
              {area ? `${area}’s` : `${city}’s`} Most Visionary Developments
            </p>
          </div>
        </div>

        {/* Mobile: stacked column, Desktop: absolute positioned mosaic */}
        <div className="ll-grid-wrap">
          {displayProjects.map((prop) => (
            <div key={prop.id} className={`ll-card ll-card-${prop.id}`}>
              <PropertyCard prop={prop} />
            </div>
          ))}
        </div>

        <style>{`
          .ll-grid-wrap {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          .ll-card {
            border-radius: 20px;
            overflow: hidden;
          }
          .ll-card > div {
            height: 100% !important;
          }

          @media (min-width: 768px) {
            .ll-grid-wrap {
              position: relative;
              display: block;
              height: 600px;
            }
            .ll-card {
              position: absolute;
            }
            ${displayProjects.map(p => `
            .ll-card-${p.id} {
              left: ${p.pos.left};
              top: ${p.pos.top};
              width: calc(${p.pos.width} - 8px);
              height: calc(${p.pos.height} - 8px);
            }`).join('')}
          }

          @media (min-width: 1024px) {
            .ll-grid-wrap { height: 800px; }
          }
          @media (min-width: 1280px) {
            .ll-grid-wrap { height: 900px; }
          }
        `}</style>
      </div>

      {/* Smooth bottom fade transition into the next section */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '150px',
        background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, #ffffff 100%)',
        pointerEvents: 'none',
        zIndex: 2,
      }} />
    </section>
  );
}
