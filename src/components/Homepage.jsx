import React, { useEffect, useRef } from 'react';
import { sound } from '../audio';

export default function Homepage({ onStart, onTutorial }) {
  const canvasRef = useRef(null);

  // Cinematic canvas: Starfield + Solar Gravitational Lens Einstein Ring
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Stars
    const stars = Array.from({ length: 140 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.8 + 0.4,
      alpha: Math.random() * 0.7 + 0.3,
      speed: Math.random() * 0.2 + 0.05
    }));

    let t = 0;

    const render = () => {
      t += 0.008;
      ctx.fillStyle = '#060b17';
      ctx.fillRect(0, 0, width, height);

      // Deep space radial glow
      const cx = width > 900 ? width * 0.65 : width * 0.5;
      const cy = height * 0.5;
      const ringRadius = Math.min(width, height) * 0.28;

      const bgGlow = ctx.createRadialGradient(cx, cy, 10, cx, cy, ringRadius * 1.8);
      bgGlow.addColorStop(0, 'rgba(80, 180, 210, 0.12)');
      bgGlow.addColorStop(0.5, 'rgba(30, 70, 140, 0.06)');
      bgGlow.addColorStop(1, 'rgba(6, 11, 23, 0)');
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, width, height);

      // Stars
      stars.forEach(s => {
        s.y -= s.speed;
        if (s.y < 0) s.y = height;
        ctx.fillStyle = `rgba(220, 235, 255, ${s.alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // The Occulted Sun (Coronagraph dark disk)
      ctx.fillStyle = '#03060c';
      ctx.beginPath();
      ctx.arc(cx, cy, ringRadius * 0.72, 0, Math.PI * 2);
      ctx.fill();

      // Outer Solar Corona
      const corona = ctx.createRadialGradient(cx, cy, ringRadius * 0.7, cx, cy, ringRadius * 1.3);
      corona.addColorStop(0, 'rgba(255, 170, 90, 0.35)');
      corona.addColorStop(0.4, 'rgba(255, 120, 50, 0.1)');
      corona.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = corona;
      ctx.beginPath();
      ctx.arc(cx, cy, ringRadius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Glowing Einstein Ring
      ctx.save();
      ctx.shadowBlur = 25;
      ctx.shadowColor = '#70ddd1';
      ctx.strokeStyle = 'rgba(112, 221, 209, 0.85)';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Rotating exoplanet light arcs
      for (let i = 0; i < 3; i++) {
        const start = t + (i * Math.PI * 2) / 3;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(cx, cy, ringRadius, start, start + 0.4);
        ctx.stroke();
      }
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="home-clean-screen">
      <canvas ref={canvasRef} className="home-canvas" />

      <div className="home-clean-content">
        <div className="home-badge-pill">
          <span>●</span> SGL EXPEDITION · 650 AU
        </div>

        <h1 className="home-hero-title">
          MIRAGE<br />
          <span>HORIZON</span>
        </h1>

        <p className="home-hero-sub">
          SOLAR GRAVITATIONAL LENS MISSION SIMULATOR
        </p>

        {/* Clean, focused primary actions (NO mission brief button on homepage) */}
        <div className="home-hero-actions">
          <button
            className="home-play-btn"
            onClick={() => {
              sound.success();
              onStart();
            }}
          >
            START MISSION 🚀
          </button>

          <button
            className="home-sub-btn"
            onClick={() => {
              sound.click();
              onTutorial();
            }}
          >
            Flight Tutorial
          </button>
        </div>

        {/* Minimal visual image badges */}
        <div className="home-image-tags">
          <div className="img-tag">
            <span className="img-tag-icon">🪐</span>
            <div>
              <b>Exoplanet SGL</b>
              <small>LHS 1140 b</small>
            </div>
          </div>
          <div className="img-tag">
            <span className="img-tag-icon">🚀</span>
            <div>
              <b>SFS Assembly</b>
              <small>Realistic Physics</small>
            </div>
          </div>
          <div className="img-tag">
            <span className="img-tag-icon">🔭</span>
            <div>
              <b>Einstein Ring</b>
              <small>Focal Deconvolution</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
