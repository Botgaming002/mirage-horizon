import React from 'react';

// Authentic Spaceflight Simulator (SFS) Vector Graphics Generator
// Renders realistic white aerospace tanks, corrugated engine bells, capsules, interstage trusses, and nosecones

export function PartSvg({ type, width = 64, height = 64, scale = 1, isSide = false, flipped = false }) {
  const actualW = width * scale;
  const actualH = height * scale;

  return (
    <svg
      width={actualW}
      height={actualH}
      viewBox="0 0 100 100"
      style={{
        display: 'block',
        transform: flipped ? 'scaleX(-1)' : 'none',
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))'
      }}
    >
      <defs>
        {/* White cylinder shading (realistic 3D curved lighting) */}
        <linearGradient id="sfsWhiteCylinder" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c5cbd6" />
          <stop offset="25%" stopColor="#ffffff" />
          <stop offset="65%" stopColor="#eaedf2" />
          <stop offset="90%" stopColor="#b6bfc9" />
          <stop offset="100%" stopColor="#8d97a5" />
        </linearGradient>

        {/* Engine bell metallic corrugated texture */}
        <linearGradient id="sfsEngineMetal" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1e2025" />
          <stop offset="35%" stopColor="#4f545f" />
          <stop offset="70%" stopColor="#2b2d34" />
          <stop offset="100%" stopColor="#151619" />
        </linearGradient>

        {/* Capsule dark cone gradient */}
        <linearGradient id="sfsCapsuleDark" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22252a" />
          <stop offset="30%" stopColor="#484d57" />
          <stop offset="70%" stopColor="#2c3036" />
          <stop offset="100%" stopColor="#15171a" />
        </linearGradient>

        {/* Interstage truss steel strut pattern */}
        <linearGradient id="sfsStrutMetal" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7a8494" />
          <stop offset="50%" stopColor="#cdd4df" />
          <stop offset="100%" stopColor="#5d6573" />
        </linearGradient>
      </defs>

      {/* 1. AERODYNAMIC NOSECONE */}
      {type === 'nosecone' && (
        <g>
          <path
            d="M 50,4 Q 85,60 85,96 L 15,96 Q 15,60 50,4 Z"
            fill="url(#sfsWhiteCylinder)"
            stroke="#677382"
            strokeWidth="1.5"
          />
          {/* Tip dome */}
          <ellipse cx="50" cy="8" rx="8" ry="4" fill="#88929e" />
          {/* Base weld ring */}
          <rect x="15" y="92" width="70" height="4" fill="#a4afbd" />
        </g>
      )}

      {/* 2. RADIAL BOOSTER NOSECONE (SLANTED) */}
      {type === 'booster_nose' && (
        <g>
          <path
            d="M 25,6 Q 85,45 85,96 L 15,96 Q 15,50 25,6 Z"
            fill="url(#sfsWhiteCylinder)"
            stroke="#677382"
            strokeWidth="1.5"
          />
          {/* Slanted cap */}
          <circle cx="28" cy="10" r="5" fill="#88929e" />
          <rect x="15" y="92" width="70" height="4" fill="#a4afbd" />
        </g>
      )}

      {/* 3. COMMAND CAPSULE / PROBE */}
      {type === 'capsule' && (
        <g>
          {/* Capsule conical body */}
          <polygon
            points="32,15 68,15 84,84 16,84"
            fill="url(#sfsCapsuleDark)"
            stroke="#111316"
            strokeWidth="1.5"
          />
          {/* Heat shield rim */}
          <rect x="14" y="84" width="72" height="8" rx="2" fill="#8a532d" stroke="#523018" strokeWidth="1" />
          {/* Docking nose cap */}
          <ellipse cx="50" cy="15" rx="18" ry="6" fill="#88929e" />
          {/* Cyan viewport glass */}
          <rect x="42" y="32" width="16" height="8" rx="3" fill="#69dbd0" stroke="#1b2838" strokeWidth="1" />
          {/* RCS nozzle dots */}
          <circle cx="24" cy="55" r="2.5" fill="#151619" />
          <circle cx="76" cy="55" r="2.5" fill="#151619" />
        </g>
      )}

      {/* 4. FUEL TANK (SMALL) */}
      {type === 'tank_small' && (
        <g>
          <rect x="15" y="8" width="70" height="84" rx="2" fill="url(#sfsWhiteCylinder)" stroke="#677382" strokeWidth="1.5" />
          {/* Top & bottom weld bands */}
          <line x1="15" y1="18" x2="85" y2="18" stroke="#a4afbd" strokeWidth="2" />
          <line x1="15" y1="82" x2="85" y2="82" stroke="#a4afbd" strokeWidth="2" />
          {/* Cryogenic service port */}
          <rect x="46" y="44" width="8" height="12" rx="2" fill="#758292" />
        </g>
      )}

      {/* 5. FUEL TANK (MEDIUM) */}
      {type === 'tank_med' && (
        <g>
          <rect x="15" y="4" width="70" height="92" rx="2" fill="url(#sfsWhiteCylinder)" stroke="#677382" strokeWidth="1.5" />
          <line x1="15" y1="14" x2="85" y2="14" stroke="#a4afbd" strokeWidth="2" />
          <line x1="15" y1="50" x2="85" y2="50" stroke="#bdc7d4" strokeWidth="1.5" />
          <line x1="15" y1="86" x2="85" y2="86" stroke="#a4afbd" strokeWidth="2" />
          <rect x="45" y="30" width="10" height="16" rx="2" fill="#6e7a88" />
        </g>
      )}

      {/* 6. FUEL TANK (LARGE / TALL CORE) */}
      {type === 'tank_large' && (
        <g>
          <rect x="15" y="2" width="70" height="96" rx="2" fill="url(#sfsWhiteCylinder)" stroke="#677382" strokeWidth="1.5" />
          <line x1="15" y1="12" x2="85" y2="12" stroke="#a4afbd" strokeWidth="2" />
          <line x1="15" y1="36" x2="85" y2="36" stroke="#bdc7d4" strokeWidth="1.5" />
          <line x1="15" y1="64" x2="85" y2="64" stroke="#bdc7d4" strokeWidth="1.5" />
          <line x1="15" y1="88" x2="85" y2="88" stroke="#a4afbd" strokeWidth="2" />
          <rect x="45" y="42" width="10" height="20" rx="2" fill="#626e7d" />
        </g>
      )}

      {/* 7. RADIAL STRAP-ON BOOSTER TANK */}
      {type === 'tank_booster' && (
        <g>
          <rect x="18" y="4" width="64" height="92" rx="2" fill="url(#sfsWhiteCylinder)" stroke="#677382" strokeWidth="1.5" />
          <line x1="18" y1="16" x2="82" y2="16" stroke="#a4afbd" strokeWidth="2" />
          <line x1="18" y1="84" x2="82" y2="84" stroke="#a4afbd" strokeWidth="2" />
          {/* Radial separator bracket mounts */}
          <rect x="8" y="28" width="10" height="12" fill="#4d5563" />
          <rect x="8" y="66" width="10" height="12" fill="#4d5563" />
        </g>
      )}

      {/* 8. INTERSTAGE TRUSS */}
      {type === 'interstage' && (
        <g>
          {/* Top/bottom mounting rings */}
          <rect x="15" y="6" width="70" height="8" fill="#48505e" />
          <rect x="15" y="86" width="70" height="8" fill="#48505e" />
          {/* Hollow lattice interior */}
          <rect x="16" y="14" width="68" height="72" fill="#0d1424" />
          {/* Vertical steel struts */}
          <line x1="22" y1="14" x2="22" y2="86" stroke="url(#sfsStrutMetal)" strokeWidth="4" />
          <line x1="36" y1="14" x2="36" y2="86" stroke="url(#sfsStrutMetal)" strokeWidth="4" />
          <line x1="50" y1="14" x2="50" y2="86" stroke="url(#sfsStrutMetal)" strokeWidth="5" />
          <line x1="64" y1="14" x2="64" y2="86" stroke="url(#sfsStrutMetal)" strokeWidth="4" />
          <line x1="78" y1="14" x2="78" y2="86" stroke="url(#sfsStrutMetal)" strokeWidth="4" />
          {/* Internal engine nozzle peeking through truss */}
          <path d="M 40,24 Q 50,55 50,70 Q 50,55 60,24 Z" fill="#22252a" />
        </g>
      )}

      {/* 9. STAGING DECOUPLER RING */}
      {type === 'decoupler' && (
        <g>
          <rect x="15" y="32" width="70" height="36" rx="3" fill="#a4afbd" stroke="#4a5360" strokeWidth="2" />
          {/* Red/Yellow hazard indicator stripe */}
          <rect x="18" y="44" width="64" height="12" fill="#ffd13b" />
          <line x1="24" y1="44" x2="30" y2="56" stroke="#222" strokeWidth="3" />
          <line x1="36" y1="44" x2="42" y2="56" stroke="#222" strokeWidth="3" />
          <line x1="48" y1="44" x2="54" y2="56" stroke="#222" strokeWidth="3" />
          <line x1="60" y1="44" x2="66" y2="56" stroke="#222" strokeWidth="3" />
          <line x1="72" y1="44" x2="78" y2="56" stroke="#222" strokeWidth="3" />
        </g>
      )}

      {/* 10. TITAN MAIN ENGINE */}
      {type === 'engine_titan' && (
        <g>
          {/* Turbopump gimbal mount */}
          <rect x="36" y="4" width="28" height="14" fill="#586374" stroke="#2b313b" strokeWidth="1" />
          <circle cx="50" cy="11" r="4" fill="#a4afbd" />
          {/* Corrugated bell nozzle */}
          <path
            d="M 38,18 L 62,18 L 82,92 L 18,92 Z"
            fill="url(#sfsEngineMetal)"
            stroke="#101114"
            strokeWidth="1.5"
          />
          {/* Bell cooling ribs */}
          <line x1="22" y1="80" x2="78" y2="80" stroke="#484d57" strokeWidth="2" />
          <line x1="27" y1="65" x2="73" y2="65" stroke="#484d57" strokeWidth="2" />
          <line x1="32" y1="48" x2="68" y2="48" stroke="#484d57" strokeWidth="2" />
          <line x1="36" y1="32" x2="64" y2="32" stroke="#484d57" strokeWidth="2" />
          {/* Exhaust glow core inside bell */}
          <ellipse cx="50" cy="92" rx="30" ry="5" fill="#ff7733" />
        </g>
      )}

      {/* 11. HAWK BOOSTER ENGINE */}
      {type === 'engine_hawk' && (
        <g>
          <rect x="40" y="8" width="20" height="12" fill="#586374" />
          <path
            d="M 40,20 L 60,20 L 76,90 L 24,90 Z"
            fill="url(#sfsEngineMetal)"
            stroke="#101114"
            strokeWidth="1.5"
          />
          <line x1="28" y1="78" x2="72" y2="78" stroke="#484d57" strokeWidth="2" />
          <line x1="33" y1="60" x2="67" y2="60" stroke="#484d57" strokeWidth="2" />
          <line x1="38" y1="40" x2="62" y2="40" stroke="#484d57" strokeWidth="2" />
          <ellipse cx="50" cy="90" rx="24" ry="4" fill="#ff8844" />
        </g>
      )}

      {/* 12. FRONTIER VACUUM ENGINE */}
      {type === 'engine_frontier' && (
        <g>
          <rect x="42" y="6" width="16" height="14" fill="#586374" />
          {/* Wide expansion bell */}
          <path
            d="M 42,20 L 58,20 L 86,94 L 14,94 Z"
            fill="url(#sfsEngineMetal)"
            stroke="#101114"
            strokeWidth="1.5"
          />
          <line x1="20" y1="84" x2="80" y2="84" stroke="#484d57" strokeWidth="1.5" />
          <line x1="28" y1="68" x2="72" y2="68" stroke="#484d57" strokeWidth="1.5" />
          <line x1="36" y1="46" x2="64" y2="46" stroke="#484d57" strokeWidth="1.5" />
          <ellipse cx="50" cy="94" rx="34" ry="5" fill="#4488ff" />
        </g>
      )}

      {/* 13. ION CRUISE ENGINE */}
      {type === 'engine_ion' && (
        <g>
          <rect x="30" y="16" width="40" height="40" rx="4" fill="#333945" stroke="#1d2128" strokeWidth="1.5" />
          {/* Xenon grid screen */}
          <circle cx="50" cy="74" r="18" fill="#151b28" stroke="#70ddd1" strokeWidth="2" />
          <circle cx="50" cy="74" r="10" fill="#70ddd1" opacity="0.75" />
          {/* Blue ion plasma glow */}
          <ellipse cx="50" cy="74" rx="14" ry="8" fill="#00eeff" opacity="0.8" />
        </g>
      )}

      {/* 14. MMRTG NUCLEAR CORE */}
      {type === 'rtg' && (
        <g>
          <rect x="32" y="18" width="36" height="64" rx="3" fill="#2c3039" stroke="#15171b" strokeWidth="1.5" />
          {/* Radiator cooling fins */}
          <line x1="20" y1="28" x2="32" y2="28" stroke="#ffaa44" strokeWidth="3" />
          <line x1="68" y1="28" x2="80" y2="28" stroke="#ffaa44" strokeWidth="3" />
          <line x1="20" y1="44" x2="32" y2="44" stroke="#ffaa44" strokeWidth="3" />
          <line x1="68" y1="44" x2="80" y2="44" stroke="#ffaa44" strokeWidth="3" />
          <line x1="20" y1="60" x2="32" y2="60" stroke="#ffaa44" strokeWidth="3" />
          <line x1="68" y1="60" x2="80" y2="60" stroke="#ffaa44" strokeWidth="3" />
          <line x1="20" y1="74" x2="32" y2="74" stroke="#ffaa44" strokeWidth="3" />
          <line x1="68" y1="74" x2="80" y2="74" stroke="#ffaa44" strokeWidth="3" />
          {/* Radioactive hazard trefoil symbol */}
          <circle cx="50" cy="50" r="8" fill="#ffd13b" />
          <circle cx="50" cy="50" r="3" fill="#15171b" />
        </g>
      )}

      {/* 15. SOLAR WINGS */}
      {type === 'solar_wings' && (
        <g>
          <rect x="44" y="10" width="12" height="80" fill="#424c5b" />
          {/* Blue photovoltaic cells left wing */}
          <rect x="8" y="24" width="36" height="52" fill="#1c3b70" stroke="#77aaff" strokeWidth="1" />
          <line x1="20" y1="24" x2="20" y2="76" stroke="#77aaff" strokeWidth="1" />
          <line x1="32" y1="24" x2="32" y2="76" stroke="#77aaff" strokeWidth="1" />
          {/* Blue photovoltaic cells right wing */}
          <rect x="56" y="24" width="36" height="52" fill="#1c3b70" stroke="#77aaff" strokeWidth="1" />
          <line x1="68" y1="24" x2="68" y2="76" stroke="#77aaff" strokeWidth="1" />
          <line x1="80" y1="24" x2="80" y2="76" stroke="#77aaff" strokeWidth="1" />
        </g>
      )}
    </svg>
  );
}
