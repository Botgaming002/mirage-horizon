import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../audio';

export default function EinsteinRing({
  target,
  focalDistance,
  playerData,
  onFinishExperiment
}) {
  const [offsetX, setOffsetX] = useState(35);
  const [offsetY, setOffsetY] = useState(-25);
  const [activeFilter, setActiveFilter] = useState('optical'); // 'optical' | 'infrared' | 'spectrometer'
  const [integrationProgress, setIntegrationProgress] = useState(30);
  const [isExposing, setIsExposing] = useState(false);
  const [reconstructedImageQuality, setReconstructedImageQuality] = useState(0);

  const canvasRef = useRef(null);

  // Alignment accuracy based on distance from center (0, 0)
  const distFromCenter = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
  const alignmentPercent = Math.max(10, Math.min(100, Math.round(100 - distFromCenter * 1.5)));

  // Continuous Exposure accumulator
  useEffect(() => {
    let interval;
    if (isExposing) {
      sound.scan();
      interval = setInterval(() => {
        setIntegrationProgress(p => {
          if (p >= 100) {
            setIsExposing(false);
            sound.success();
            return 100;
          }
          return p + 4;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isExposing]);

  // Overall Image Quality calculation
  useEffect(() => {
    const quality = Math.round((alignmentPercent * 0.5) + (integrationProgress * 0.5));
    setReconstructedImageQuality(quality);
  }, [alignmentPercent, integrationProgress]);

  // Viewfinder Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const render = () => {
      const w = (canvas.width = 460);
      const h = (canvas.height = 460);
      const cx = w / 2;
      const cy = h / 2;

      ctx.fillStyle = '#050813';
      ctx.fillRect(0, 0, w, h);

      // Deep space grid
      ctx.strokeStyle = 'rgba(32, 43, 60, 0.4)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Apparent center with telescope drift offset
      const ringCx = cx + offsetX;
      const ringCy = cy + offsetY;
      const ringRadius = 140;

      // Occulted Sun mask (Coronagraph Lyot stop)
      ctx.fillStyle = '#020307';
      ctx.beginPath();
      ctx.arc(ringCx, ringCy, ringRadius * 0.75, 0, Math.PI * 2);
      ctx.fill();

      // Outer Corona Glow
      const corona = ctx.createRadialGradient(ringCx, ringCy, ringRadius * 0.7, ringCx, ringCy, ringRadius * 1.4);
      corona.addColorStop(0, 'rgba(255, 180, 100, 0.35)');
      corona.addColorStop(0.3, 'rgba(255, 120, 60, 0.12)');
      corona.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = corona;
      ctx.beginPath();
      ctx.arc(ringCx, ringCy, ringRadius * 1.4, 0, Math.PI * 2);
      ctx.fill();

      // Einstein Ring glow
      const ringIntensity = (alignmentPercent / 100) * (0.4 + (integrationProgress / 100) * 0.6);
      ctx.save();
      ctx.shadowBlur = alignmentPercent > 80 ? 25 : 10;

      let ringColor = '112, 221, 209'; // Optical Cyan
      if (activeFilter === 'infrared') ringColor = '255, 140, 100'; // Amber/Red
      if (activeFilter === 'spectrometer') ringColor = '189, 154, 255'; // Violet/Rainbow

      ctx.shadowColor = `rgb(${ringColor})`;

      // Primary Einstein Ring
      ctx.strokeStyle = `rgba(${ringColor}, ${ringIntensity})`;
      ctx.lineWidth = 4 + (integrationProgress / 30);
      ctx.beginPath();
      ctx.arc(ringCx, ringCy, ringRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Secondary diffraction harmonics
      ctx.strokeStyle = `rgba(${ringColor}, ${ringIntensity * 0.4})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(ringCx, ringCy, ringRadius + 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Central crosshair reticle (Targeting axis)
      ctx.strokeStyle = alignmentPercent > 85 ? '#70dfaa' : 'rgba(255, 124, 130, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 6]);

      // Crosshair lines
      ctx.beginPath();
      ctx.moveTo(cx - 50, cy);
      ctx.lineTo(cx + 50, cy);
      ctx.moveTo(cx, cy - 50);
      ctx.lineTo(cx, cy + 50);
      ctx.stroke();

      // Target lock box
      ctx.strokeRect(cx - 25, cy - 25, 50, 50);
      ctx.setLineDash([]);

      // Corner brackets
      ctx.strokeStyle = '#70ddd1';
      const bracketSize = 15;
      const bMargin = 20;

      // Top-Left
      ctx.beginPath();
      ctx.moveTo(bMargin, bMargin + bracketSize);
      ctx.lineTo(bMargin, bMargin);
      ctx.lineTo(bMargin + bracketSize, bMargin);
      ctx.stroke();

      // Bottom-Right
      ctx.beginPath();
      ctx.moveTo(w - bMargin, h - bMargin - bracketSize);
      ctx.lineTo(w - bMargin, h - bMargin);
      ctx.lineTo(w - bMargin - bracketSize, h - bMargin);
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [offsetX, offsetY, alignmentPercent, integrationProgress, activeFilter]);

  // Thruster nudge handlers
  const nudge = (dx, dy) => {
    sound.beep(600);
    setOffsetX(x => Math.max(-60, Math.min(60, x + dx)));
    setOffsetY(y => Math.max(-60, Math.min(60, y + dy)));
  };

  const autoCenter = () => {
    sound.snap();
    setOffsetX(0);
    setOffsetY(0);
  };

  return (
    <section className="einstein-wrapper">
      <div className="einstein-container">
        {/* Header */}
        <div className="einstein-header">
          <div>
            <span className="section-kicker">07 / SGL FOCAL PLANE EXPERIMENT</span>
            <h2>Einstein Ring Acquisition & Coronagraph Alignment</h2>
          </div>
          <div className="target-pill">
            <span>TARGET: {target?.name || 'Exoplanet'}</span>
            <small>FOCAL DISTANCE: {focalDistance} AU</small>
          </div>
        </div>

        <div className="experiment-grid">
          {/* LEFT: TELESCOPE VIEWFINDER */}
          <div className="viewfinder-panel">
            <div className="viewfinder-top">
              <span>CORONAGRAPH OPTICAL APERTURE</span>
              <span className={`align-badge ${alignmentPercent > 80 ? 'align-good' : 'align-poor'}`}>
                ALIGNMENT: {alignmentPercent}%
              </span>
            </div>

            <div className="canvas-frame">
              <canvas ref={canvasRef} className="viewfinder-canvas" />

              <div className="overlay-instructions">
                {alignmentPercent < 80 ? (
                  <span>⚠️ Telescope off-axis. Use thrusters to center crosshair!</span>
                ) : (
                  <span>✅ Focal line locked! Accumulate exposure integration.</span>
                )}
              </div>
            </div>

            {/* Micro-Thruster Directional Controls */}
            <div className="thruster-controls">
              <span className="controls-label">Reaction Thruster Gimbal:</span>
              <div className="dpad">
                <button className="d-btn up" onClick={() => nudge(0, 8)}>▲</button>
                <div className="d-row">
                  <button className="d-btn left" onClick={() => nudge(8, 0)}>◀</button>
                  <button className="d-btn center" onClick={autoCenter} title="Star Tracker Auto-Lock">
                    AUTO
                  </button>
                  <button className="d-btn right" onClick={() => nudge(-8, 0)}>▶</button>
                </div>
                <button className="d-btn down" onClick={() => nudge(0, -8)}>▼</button>
              </div>
            </div>
          </div>

          {/* RIGHT: SCIENTIFIC INSTRUMENTS & DECONVOLUTION RECONSTRUCTION */}
          <div className="science-panel">
            {/* Filter Selection */}
            <div className="instrument-card">
              <h4>Spectrographic Filter Selector</h4>
              <div className="filter-buttons">
                <button
                  className={`filter-btn ${activeFilter === 'optical' ? 'active' : ''}`}
                  onClick={() => { sound.click(); setActiveFilter('optical'); }}
                >
                  👁 Visible Optical (Continents & Clouds)
                </button>
                <button
                  className={`filter-btn ${activeFilter === 'infrared' ? 'active' : ''}`}
                  onClick={() => { sound.click(); setActiveFilter('infrared'); }}
                >
                  🌡 Thermal Infrared (Temperature Maps)
                </button>
                <button
                  className={`filter-btn ${activeFilter === 'spectrometer' ? 'active' : ''}`}
                  onClick={() => { sound.click(); setActiveFilter('spectrometer'); }}
                >
                  🌈 High-Res Spectrometer (Atmospheric Gases)
                </button>
              </div>
            </div>

            {/* Photon Integration Shutter */}
            <div className="instrument-card">
              <div className="exposure-row">
                <div>
                  <h4>Photon Integration Accumulator</h4>
                  <small>Continuous sensor exposure to deconvolve exoplanet pixels</small>
                </div>
                <b>{integrationProgress}%</b>
              </div>

              <div className="gauge-bar">
                <div
                  className="gauge-fill"
                  style={{ width: `${integrationProgress}%`, background: 'var(--cyan)' }}
                />
              </div>

              <div className="shutter-actions">
                <button
                  className={`shutter-btn ${isExposing ? 'exposing' : ''}`}
                  onClick={() => setIsExposing(!isExposing)}
                >
                  {isExposing ? '⏸ Pause Exposure' : '📸 Accumulate Photons (Expose)'}
                </button>

                <button
                  className="secondary-btn"
                  onClick={() => {
                    sound.scan();
                    setIntegrationProgress(100);
                  }}
                >
                  ⚡ Fast Integration
                </button>
              </div>
            </div>

            {/* Real-time Reconstructed Planetary Image */}
            <div className="reconstruction-card">
              <div className="recon-header">
                <h4>Reconstructed Exoplanet Surface Map</h4>
                <span className="recon-quality">RESOLUTION: {reconstructedImageQuality}%</span>
              </div>

              <div className="recon-viewport">
                <div
                  className="recon-planet-disc"
                  style={{
                    filter: `blur(${Math.max(0, (100 - reconstructedImageQuality) / 10)}px)`,
                    opacity: 0.3 + (reconstructedImageQuality / 100) * 0.7,
                    background:
                      activeFilter === 'infrared'
                        ? 'radial-gradient(circle at 40% 40%, #ff8866 0%, #aa3322 60%, #110505 100%)'
                        : activeFilter === 'spectrometer'
                        ? 'radial-gradient(circle at 40% 40%, #c49aff 0%, #5533aa 60%, #05051a 100%)'
                        : `radial-gradient(circle at 35% 35%, #ffffff 0%, ${target?.color || '#5bd9d0'} 45%, #0f1c2e 100%)`
                  }}
                >
                  {/* Procedural continent shapes */}
                  <div className="recon-continent c1" />
                  <div className="recon-continent c2" />
                  <div className="recon-clouds" />
                </div>

                <div className="recon-info-overlay">
                  {reconstructedImageQuality > 75 ? (
                    <div className="recon-verdict-good">
                      ✓ SURFACE CONTINENTS & OCEAN GLINT DETECTED!
                    </div>
                  ) : (
                    <div className="recon-verdict-poor">
                      Image blurry. Increase alignment & exposure integration.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Proceed to Downlink */}
            <button
              className="primary-btn downlink-btn pulse-glow"
              onClick={() => {
                sound.success();
                onFinishExperiment({
                  imageQuality: reconstructedImageQuality,
                  alignment: alignmentPercent,
                  integration: integrationProgress
                });
              }}
            >
              Finish Observation & Transmit to Earth 📡 →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
