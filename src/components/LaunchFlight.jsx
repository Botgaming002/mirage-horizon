import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../audio';

export const ORBITAL_LEVELS = [
  {
    id: 'leo',
    name: 'Low Earth Orbit (LEO)',
    altitudeKm: 300,
    velocityKms: 7.73,
    periodMin: 90.5,
    tag: 'MAXIMUM OBERTH EFFECT',
    desc: 'Orbiting 300 km above Earth, beneath the Van Allen radiation belts. Spacecraft travels at 7.7 km/s. Ideal for systems checkouts and harnesses the Oberth effect for high-efficiency solar escape burns.'
  },
  {
    id: 'meo',
    name: 'Medium Earth Orbit (MEO)',
    altitudeKm: 5000,
    velocityKms: 5.92,
    periodMin: 201,
    tag: 'INTERMEDIATE GRAVITATIONAL WELL',
    desc: 'Positioned at 5,000 km altitude within the outer magnetosphere. Provides wide Earth monitoring and reduces atmospheric atomic oxygen erosion while climbing the gravitational hill.'
  },
  {
    id: 'geo',
    name: 'Geostationary Orbit (GEO)',
    altitudeKm: 35786,
    velocityKms: 3.07,
    periodMin: 1436, // 24 hours
    tag: 'HIGH POTENTIAL ENERGY',
    desc: 'At 35,786 km, the spacecraft orbital period matches Earth’s 24-hour rotation, remaining parked over ground stations. Already high in Earth’s gravity well, minimal delta-V is needed to escape to deep space.'
  },
  {
    id: 'hyperbolic',
    name: 'Direct Hyperbolic Escape',
    altitudeKm: 120000,
    velocityKms: 11.2,
    periodMin: 0,
    tag: 'SOLAR ESCAPE TRAJECTORY',
    desc: 'Skips parking orbits entirely. Burns all cryogenic stages to exceed Earth’s escape velocity (11.2 km/s), launching directly toward the Jupiter gravity assist corridor to reach 650 AU.'
  }
];

export default function LaunchFlight({
  playerData,
  focalDistance = 650,
  target,
  onArrival,
  onAbortToHangar
}) {
  // Flight phases: 'cutscene' | 'orbit_config' | 'cruise' | 'failed'
  const [flightPhase, setFlightPhase] = useState('cutscene');
  const [shotIndex, setShotIndex] = useState(0);

  // Orbital Level adjustment state
  const [selectedOrbitId, setSelectedOrbitId] = useState('leo');
  const activeOrbit = ORBITAL_LEVELS.find(o => o.id === selectedOrbitId) || ORBITAL_LEVELS[0];

  // Live telemetry metrics
  const [altitudeKm, setAltitudeKm] = useState(0);
  const [speedKms, setSpeedKms] = useState(0);
  const [gForce, setGForce] = useState(1.0);
  const [currentAu, setCurrentAu] = useState(1.0);
  const [missionYear, setMissionYear] = useState(0);
  const [warpSpeed, setWarpSpeed] = useState(1);
  const [failureReason, setFailureReason] = useState(null);

  const canvasRef = useRef(null);
  const orbitCanvasRef = useRef(null);

  const twr = playerData?.twr || 1.85;
  const deltaV = playerData?.deltaV || 15200;
  const hasRTG = playerData?.checks?.deepSpacePower?.passed ?? true;
  const hasNosecone = playerData?.checks?.hasNosecone?.passed ?? true;

  // Realistic Liftoff Verification
  useEffect(() => {
    if (twr < 1.0) {
      setFlightPhase('failed');
      setFailureReason('LAUNCHPAD FAILURE: Thrust-to-Weight Ratio < 1.0. Rocket weight exceeds engine thrust; vehicle failed to lift off.');
    }
  }, [twr]);

  // Cinematic Cutscene Timeline Driver
  useEffect(() => {
    if (flightPhase !== 'cutscene') return;

    sound.launchRoar(6);

    const shotTimers = [
      setTimeout(() => {
        sound.beep(800);
        setShotIndex(1);
        setAltitudeKm(8);
        setSpeedKms(0.85);
        setGForce(1.6);
      }, 3500),

      setTimeout(() => {
        if (!hasNosecone) {
          setFlightPhase('failed');
          setFailureReason('MAX-Q AERODYNAMIC DESTRUCTION: Launched without an aerodynamic fairing cone. Supersonic dynamic pressure shattered the payload.');
          return;
        }
        if (twr < 1.25) {
          setFlightPhase('failed');
          setFailureReason(`GRAVITY DRAG STALL: Liftoff TWR was ${twr} (Need ≥ 1.25). Gravity drag exhausted propellant before clearing the atmosphere.`);
          return;
        }

        sound.beep(980);
        setShotIndex(2);
        setAltitudeKm(45);
        setSpeedKms(2.6);
        setGForce(2.8);
      }, 7500),

      setTimeout(() => {
        sound.beep(1200);
        setShotIndex(3);
        setAltitudeKm(110);
        setSpeedKms(5.8);
        setGForce(3.5);
      }, 12000),

      setTimeout(() => {
        sound.snap();
        setShotIndex(4);
        setAltitudeKm(185);
        setSpeedKms(7.9);
        setGForce(1.2);
      }, 16500),

      setTimeout(() => {
        if (deltaV < 4200) {
          setFlightPhase('failed');
          setFailureReason(`INSUFFICIENT DELTA-V: Vehicle achieved initial climb but has only ${deltaV.toLocaleString()} m/s (Need ≥ 4,200 m/s for orbital insertion & solar escape).`);
          return;
        }
        sound.success();
        setShotIndex(5);
        setAltitudeKm(300);
        setSpeedKms(7.73);
      }, 21000),

      setTimeout(() => {
        // Transition to orbital adjustment phase so player can explore orbital mechanics!
        setFlightPhase('orbit_config');
      }, 25500)
    ];

    return () => shotTimers.forEach(t => clearTimeout(t));
  }, [flightPhase, twr, deltaV, hasNosecone]);

  // Orbit visualization canvas
  useEffect(() => {
    if (flightPhase !== 'orbit_config') return;
    const canvas = orbitCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let satAngle = 0;

    const render = () => {
      const w = (canvas.width = canvas.parentElement.clientWidth || 700);
      const h = (canvas.height = 320);
      const cx = w / 2;
      const cy = h / 2;

      ctx.fillStyle = '#060b17';
      ctx.fillRect(0, 0, w, h);

      // Starfield
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let i = 0; i < 40; i++) {
        ctx.fillRect((i * 143) % w, (i * 97) % h, 1.5, 1.5);
      }

      // Earth body in center
      const earthRadius = 38;
      const earthGrad = ctx.createRadialGradient(cx - 10, cy - 10, 5, cx, cy, earthRadius);
      earthGrad.addColorStop(0, '#74b9ff');
      earthGrad.addColorStop(0.5, '#0984e3');
      earthGrad.addColorStop(1, '#0c2461');
      ctx.fillStyle = earthGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, earthRadius, 0, Math.PI * 2);
      ctx.fill();

      // Atmosphere haze ring
      ctx.strokeStyle = 'rgba(116, 185, 255, 0.4)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, earthRadius + 2, 0, Math.PI * 2);
      ctx.stroke();

      // Orbit radii scaling
      let orbitR = 60; // LEO
      if (selectedOrbitId === 'meo') orbitR = 95;
      if (selectedOrbitId === 'geo') orbitR = 135;
      if (selectedOrbitId === 'hyperbolic') orbitR = 150;

      // Draw Orbit Ellipse
      ctx.save();
      ctx.strokeStyle = '#70ddd1';
      ctx.lineWidth = 2;
      if (selectedOrbitId === 'hyperbolic') {
        // Hyperbolic escape curve
        ctx.beginPath();
        ctx.moveTo(cx - 180, cy + 120);
        ctx.quadraticCurveTo(cx - 20, cy - 50, cx + 220, cy - 140);
        ctx.stroke();
      } else {
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.ellipse(cx, cy, orbitR * 1.3, orbitR, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // Satellite position animation
      satAngle += 0.02 * (1 / (orbitR / 60));
      let satX = cx + Math.cos(satAngle) * (orbitR * 1.3);
      let satY = cy + Math.sin(satAngle) * orbitR;

      if (selectedOrbitId === 'hyperbolic') {
        satX = cx + (Math.sin(satAngle * 0.5) * 160);
        satY = cy - 40 - (Math.cos(satAngle * 0.5) * 50);
      }

      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#70ddd1';
      ctx.beginPath();
      ctx.arc(satX, satY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#70ddd1';
      ctx.font = '10px monospace';
      ctx.fillText('🛰 SPACECRAFT', satX + 8, satY - 6);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [flightPhase, selectedOrbitId]);

  // Deep space cruise simulation
  useEffect(() => {
    if (flightPhase !== 'cruise') return;

    const interval = setInterval(() => {
      setCurrentAu(au => {
        if (!hasRTG && au > 5.5) {
          clearInterval(interval);
          setFlightPhase('failed');
          setFailureReason('DEEP SPACE BLACKOUT: Solar panels lost 99% output beyond Jupiter (5.2 AU). No MMRTG equipped; mission went dark.');
          return au;
        }

        if (au >= focalDistance) {
          clearInterval(interval);
          sound.success();
          return focalDistance;
        }

        const step = 3.0 * warpSpeed;
        const nextAu = Math.min(focalDistance, au + step);
        setMissionYear(y => Math.min(35, Number((y + 0.18 * warpSpeed).toFixed(1))));
        return nextAu;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [flightPhase, warpSpeed, focalDistance, hasRTG]);

  // Solar system cruise map
  useEffect(() => {
    if (flightPhase !== 'cruise') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const render = () => {
      const w = (canvas.width = canvas.parentElement.clientWidth || 800);
      const h = (canvas.height = 360);

      ctx.fillStyle = '#060c18';
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      for (let i = 0; i < 60; i++) {
        ctx.fillRect((i * 137) % w, (i * 89) % h, 1.5, 1.5);
      }

      const sunX = 40;
      const sunY = h / 2;
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 4, sunX, sunY, 35);
      sunGlow.addColorStop(0, '#fff3b0');
      sunGlow.addColorStop(0.4, '#ff9933');
      sunGlow.addColorStop(1, 'rgba(255, 80, 0, 0)');
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 35, 0, Math.PI * 2);
      ctx.fill();

      const landmarks = [
        { name: 'Earth', au: 1, x: 70, col: '#77aaff' },
        { name: 'Mars', au: 1.5, x: 110, col: '#ff7755' },
        { name: 'Jupiter (Slingshot)', au: 5.2, x: 220, col: '#ffaa66' },
        { name: 'Voyager 1', au: 160, x: 440, col: '#bd9aff' },
        { name: `SGL Focus (${focalDistance} AU)`, au: focalDistance, x: w - 70, col: '#70ddd1' }
      ];

      landmarks.forEach(lm => {
        ctx.strokeStyle = 'rgba(80, 110, 150, 0.2)';
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.arc(sunX, sunY, lm.x - sunX, -Math.PI / 3, Math.PI / 3);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = lm.col;
        ctx.beginPath();
        ctx.arc(lm.x, sunY, lm.name.includes('Focus') ? 6 : 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#8598ad';
        ctx.font = '10px monospace';
        ctx.fillText(lm.name, lm.x - 20, sunY + 18);
      });

      const progress = Math.min(1, currentAu / focalDistance);
      const shipX = 70 + progress * (w - 140);

      ctx.strokeStyle = 'rgba(112, 221, 209, 0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(70, sunY);
      ctx.lineTo(shipX, sunY);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#70ddd1';
      ctx.beginPath();
      ctx.arc(shipX, sunY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#70ddd1';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`🚀 PROBE (${Math.round(currentAu)} AU)`, shipX - 25, sunY - 12);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [flightPhase, currentAu, focalDistance]);

  const skipCutscene = () => {
    sound.snap();
    if (twr < 1.25) {
      setFlightPhase('failed');
      setFailureReason(`GRAVITY LOSS CATASTROPHE: TWR was ${twr} (Need ≥ 1.25). Rocket crashed before reaching orbit.`);
      return;
    }
    if (!hasNosecone) {
      setFlightPhase('failed');
      setFailureReason('MAX-Q AERODYNAMIC FAILURE: Launched without an aerodynamic fairing.');
      return;
    }
    if (deltaV < 4200) {
      setFlightPhase('failed');
      setFailureReason(`INSUFFICIENT DELTA-V: Delta-V was ${deltaV.toLocaleString()} m/s (Need ≥ 4,200 m/s for orbital insertion & solar escape).`);
      return;
    }
    setFlightPhase('orbit_config');
  };

  const handleExecuteEscapeBurn = () => {
    sound.success();
    sound.launchRoar(4);
    setFlightPhase('cruise');
  };

  return (
    <div className="launch-master-container">
      {/* 1. CINEMATIC CUTSCENE VIEW */}
      {flightPhase === 'cutscene' && (
        <div className={`cinematic-stage shot-${shotIndex}`}>
          <div className="cinematic-backdrop">
            <div className="cinematic-stars" />
            <div className="cinematic-earth-curve" />
            <div className="cinematic-sun-flare" />
          </div>

          <div className="cinematic-camera">
            <div className="cinematic-rocket-wrapper">
              <div className="cinematic-rocket">
                <div className={`cine-booster left ${shotIndex >= 4 ? 'jettisoned' : ''}`}>
                  <div className="cine-booster-cone" />
                  <div className="cine-booster-tank" />
                  <div className="cine-booster-engine" />
                  {shotIndex < 4 && <div className="cine-exhaust-flame booster" />}
                  {shotIndex === 4 && <div className="cine-sep-puff left" />}
                </div>

                <div className="cine-main-core">
                  <div className="cine-fairing-nose" />
                  <div className="cine-probe-capsule" />
                  <div className="cine-upper-tank" />
                  <div className="cine-interstage-truss" />
                  <div className="cine-main-tank" />
                  <div className="cine-main-engine" />
                  <div className="cine-exhaust-flame core" />
                </div>

                <div className={`cine-booster right ${shotIndex >= 4 ? 'jettisoned' : ''}`}>
                  <div className="cine-booster-cone" />
                  <div className="cine-booster-tank" />
                  <div className="cine-booster-engine" />
                  {shotIndex < 4 && <div className="cine-exhaust-flame booster" />}
                  {shotIndex === 4 && <div className="cine-sep-puff right" />}
                </div>
              </div>

              {shotIndex <= 1 && (
                <div className="cine-launchpad-smoke">
                  <div className="smoke-cloud sc1" />
                  <div className="smoke-cloud sc2" />
                  <div className="smoke-cloud sc3" />
                </div>
              )}

              {shotIndex === 2 && <div className="cine-mach-cone" />}
            </div>
          </div>

          <div className="letterbox-bar top">
            <div className="cutscene-status-tag">
              <span className="rec-dot" /> LIVE TRANSMISSION // LAUNCH COMPLEX 39-B
            </div>
            <button className="skip-cutscene-btn" onClick={skipCutscene}>
              Skip Cutscene ⏩
            </button>
          </div>

          <div className="letterbox-bar bottom">
            <div className="cutscene-caption">
              {shotIndex === 0 && 'T-00:00: Heavy Cryogenic Engines Ignition... 4,000 kN thrust clears launchpad.'}
              {shotIndex === 1 && 'T+00:04: Liftoff! Rocket accelerates past the gantry tower into morning skies.'}
              {shotIndex === 2 && 'T+00:10: Transonic breakout! Max-Q aerodynamic condensation cone forms.'}
              {shotIndex === 3 && 'T+00:18: Stratosphere cleared. Sky transitions into the dark vacuum of space.'}
              {shotIndex === 4 && 'T+00:26: Booster burnout! Dual side tanks decoupled with separation thrusters.'}
              {shotIndex === 5 && 'T+00:35: Orbital insertion verified. Parking orbit trajectory stabilized!'}
            </div>

            <div className="cutscene-hud-metrics">
              <div><small>ALTITUDE</small><b>{Math.round(altitudeKm)} km</b></div>
              <div><small>VELOCITY</small><b>{speedKms.toFixed(1)} km/s</b></div>
              <div><small>G-FORCE</small><b>{gForce.toFixed(1)} G</b></div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ORBITAL LEVEL SELECTOR & DESCRIPTION (User Requested!) */}
      {flightPhase === 'orbit_config' && (
        <div className="clean-orbit-config-screen">
          <div className="orbit-config-header">
            <div>
              <span className="section-kicker">ORBITAL DYNAMICS & PARKING INSERTION</span>
              <h3>Configure Earth Orbital Level</h3>
              <p>Select your staging orbit before initiating the deep-space burn to 650 AU.</p>
            </div>
            <button
              className="clean-play-btn pulse-glow"
              onClick={handleExecuteEscapeBurn}
            >
              🚀 Fire Solar Escape Burn to 650 AU →
            </button>
          </div>

          {/* Interactive Orbit Canvas Visualizer */}
          <div className="orbit-canvas-container">
            <canvas ref={orbitCanvasRef} className="orbit-canvas" />
          </div>

          {/* Orbital Level Selection Cards */}
          <div className="orbit-levels-grid">
            {ORBITAL_LEVELS.map(orbit => {
              const isSelected = orbit.id === selectedOrbitId;
              return (
                <div
                  key={orbit.id}
                  className={`orbit-level-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    sound.click();
                    setSelectedOrbitId(orbit.id);
                  }}
                >
                  <div className="orbit-card-top">
                    <b>{orbit.name}</b>
                    <span className="orbit-tag">{orbit.tag}</span>
                  </div>

                  <div className="orbit-metrics-row">
                    <div>
                      <small>Altitude</small>
                      <b>{orbit.altitudeKm.toLocaleString()} km</b>
                    </div>
                    <div>
                      <small>Orbital Speed</small>
                      <b>{orbit.velocityKms} km/s</b>
                    </div>
                    <div>
                      <small>Period</small>
                      <b>{orbit.periodMin > 0 ? `${orbit.periodMin} min` : 'Escape'}</b>
                    </div>
                  </div>

                  <p className="orbit-desc">{orbit.desc}</p>

                  <button className={`orbit-select-btn ${isSelected ? 'active' : ''}`}>
                    {isSelected ? '✓ Orbit Selected' : 'Set This Orbit'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. SOLAR SYSTEM CRUISE VIEW */}
      {flightPhase === 'cruise' && (
        <div className="clean-cruise-screen">
          <div className="clean-cruise-header">
            <div>
              <h3>INTERSTELLAR CRUISE TO {focalDistance} AU</h3>
              <p>Target: {target?.name} · Interplanetary Slingshot Trajectory</p>
            </div>
            <div className="cruise-warp-pills">
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)', marginRight: '6px' }}>Warp:</span>
              {[1, 5, 20].map(w => (
                <button
                  key={w}
                  className={`warp-pill ${warpSpeed === w ? 'active' : ''}`}
                  onClick={() => { sound.click(); setWarpSpeed(w); }}
                >
                  {w}x
                </button>
              ))}
              <button
                className="warp-pill jump"
                onClick={() => {
                  sound.success();
                  setCurrentAu(focalDistance);
                }}
              >
                ⚡ Jump to {focalDistance} AU
              </button>
            </div>
          </div>

          <div className="clean-canvas-box">
            <canvas ref={canvasRef} className="cruise-canvas" />
          </div>

          <div className="clean-cruise-stats">
            <div>
              <small>CURRENT DISTANCE</small>
              <b>{Math.round(currentAu)} AU</b>
            </div>
            <div>
              <small>MISSION TIME</small>
              <b>Year {missionYear}</b>
            </div>
            <div>
              <small>RADIO LATENCY</small>
              <b>{((currentAu * 8.3) / 60).toFixed(1)} Hours</b>
            </div>
            <div>
              <small>POWER STATUS</small>
              <b style={{ color: 'var(--green)' }}>MMRTG 100% Operational</b>
            </div>
          </div>

          {currentAu >= focalDistance && (
            <div className="clean-arrival-banner">
              <div>
                <b>🎯 SPACECRAFT HAS REACHED THE 650 AU FOCAL LINE!</b>
                <p>Coronagraph deployed. Exoplanet light bending into an Einstein Ring.</p>
              </div>
              <button
                className="clean-play-btn"
                onClick={() => {
                  sound.success();
                  onArrival();
                }}
              >
                Begin Einstein Ring Observation 🔬 →
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4. PHYSICAL FAILURE SCREEN */}
      {flightPhase === 'failed' && (
        <div className="clean-failure-screen">
          <div className="failure-icon">💥</div>
          <h2>MISSION FAILED: REALISTIC FLIGHT ANOMALY</h2>
          <div className="failure-reason-box">
            <p>{failureReason}</p>
          </div>
          <p className="failure-lesson">
            In real aerospace engineering, mass, thrust, and Delta-V must be rigorously balanced. Return to the hangar to adjust your staging.
          </p>
          <button className="clean-play-btn retry" onClick={onAbortToHangar}>
            ← Return to Hangar & Fix Rocket
          </button>
        </div>
      )}
    </div>
  );
}
